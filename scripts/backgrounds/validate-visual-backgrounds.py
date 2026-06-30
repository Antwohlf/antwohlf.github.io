#!/usr/bin/env python3

import argparse
import csv
import json
import math
import os
import pathlib
import urllib.error
import urllib.request
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps, ImageStat, ImageDraw, ImageFont


SEGMENTS = ["morning", "day", "evening", "night"]
SKIES = ["clear", "partly", "cloudy", "dark"]
SEASONS = ["spring", "summer", "fall", "winter"]


@dataclass
class ResolvedImage:
    key: str
    source: str
    image: Image.Image


class ValidationFailure:
    def __init__(
        self,
        check: str,
        key: str,
        message: str,
        metric: Optional[str] = None,
        value: Optional[float] = None,
        threshold: Optional[float] = None,
        artifact: Optional[str] = None,
    ):
        self.check = check
        self.key = key
        self.message = message
        self.metric = metric
        self.value = value
        self.threshold = threshold
        self.artifact = artifact

    def to_dict(self):
        return {
            "check": self.check,
            "key": self.key,
            "message": self.message,
            "metric": self.metric,
            "value": self.value,
            "threshold": self.threshold,
            "artifact": self.artifact,
        }


def clamp(value, low, high):
    return max(low, min(high, value))


def norm_roi_to_box(size: Tuple[int, int], roi: List[float]) -> Tuple[int, int, int, int]:
    width, height = size
    x0 = clamp(int(round(roi[0] * width)), 0, width - 1)
    y0 = clamp(int(round(roi[1] * height)), 0, height - 1)
    x1 = clamp(int(round(roi[2] * width)), x0 + 1, width)
    y1 = clamp(int(round(roi[3] * height)), y0 + 1, height)
    return (x0, y0, x1, y1)


def crop_roi(image: Image.Image, roi: List[float]) -> Image.Image:
    return image.crop(norm_roi_to_box(image.size, roi))


def shift_no_wrap(image: Image.Image, dx: int, dy: int) -> Image.Image:
    output = Image.new(image.mode, image.size, 0)
    output.paste(image, (dx, dy))
    return output


def mean_abs_diff(img_a: Image.Image, img_b: Image.Image) -> float:
    diff = ImageChops.difference(img_a, img_b)
    return float(ImageStat.Stat(diff).mean[0])


def edge_map_luma(image: Image.Image) -> Image.Image:
    return image.convert("L").filter(ImageFilter.FIND_EDGES)


def best_shift_mad(ref_edge: Image.Image, cand_edge: Image.Image, max_shift: int = 6) -> Tuple[float, int, int]:
    best = (float("inf"), 0, 0)
    for dy in range(-max_shift, max_shift + 1):
        for dx in range(-max_shift, max_shift + 1):
            shifted = shift_no_wrap(cand_edge, dx, dy)
            mad = mean_abs_diff(ref_edge, shifted)
            if mad < best[0]:
                best = (mad, dx, dy)
    return best


def percentile_threshold(gray: Image.Image, percentile: float) -> int:
    hist = gray.histogram()
    total = gray.size[0] * gray.size[1]
    if total <= 0:
        return 255
    target = total * percentile
    cumulative = 0
    for i, count in enumerate(hist):
        cumulative += count
        if cumulative >= target:
            return i
    return 255


def bright_centroid_vector(image: Image.Image, roi: List[float]) -> Optional[Tuple[float, float]]:
    crop = crop_roi(image, roi).convert("L")
    threshold = percentile_threshold(crop, 0.92)
    pixels = list(crop.getdata())
    width, height = crop.size

    total_weight = 0.0
    x_weighted = 0.0
    y_weighted = 0.0
    for idx, val in enumerate(pixels):
        if val < threshold:
            continue
        weight = float(val - threshold + 1)
        x = idx % width
        y = idx // width
        total_weight += weight
        x_weighted += x * weight
        y_weighted += y * weight

    if total_weight <= 0.0:
        return None

    cx = x_weighted / total_weight
    cy = y_weighted / total_weight
    center_x = (width - 1) / 2.0
    center_y = (height - 1) / 2.0
    vx = cx - center_x
    vy = cy - center_y
    mag = math.sqrt((vx * vx) + (vy * vy))
    if mag <= 1e-6:
        return None
    return (vx / mag, vy / mag)


def angle_deg(vec_a: Tuple[float, float], vec_b: Tuple[float, float]) -> float:
    dot = clamp((vec_a[0] * vec_b[0]) + (vec_a[1] * vec_b[1]), -1.0, 1.0)
    return math.degrees(math.acos(dot))


def sky_stats(image: Image.Image, sky_roi: List[float]) -> Dict[str, float]:
    crop = crop_roi(image, sky_roi)
    gray = crop.convert("L")
    edge = edge_map_luma(crop)
    hsv = crop.convert("HSV")
    sat = hsv.split()[1]

    return {
        "luma_mean": float(ImageStat.Stat(gray).mean[0]),
        "luma_std": float(ImageStat.Stat(gray).stddev[0]),
        "edge_mean": float(ImageStat.Stat(edge).mean[0]),
        "sat_mean": float(ImageStat.Stat(sat).mean[0]),
    }


def normalize_to_luma(image: Image.Image, target_luma: float) -> Image.Image:
    gray = image.convert("L")
    current = float(ImageStat.Stat(gray).mean[0])
    if current <= 1e-6:
        return image.copy()
    scale = target_luma / current
    enhancer = ImageEnhance.Brightness(image)
    return enhancer.enhance(scale)


def snow_ratio(image: Image.Image, ground_roi: List[float]) -> float:
    crop = crop_roi(image, ground_roi).convert("HSV")
    s = list(crop.split()[1].getdata())
    v = list(crop.split()[2].getdata())
    total = max(1, len(s))
    hits = 0
    for sat, val in zip(s, v):
        if sat < 72 and val > 165:
            hits += 1
    return hits / float(total)


def mean_luma(image: Image.Image) -> float:
    return float(ImageStat.Stat(image.convert("L")).mean[0])


def mean_rgb_ratio(image: Image.Image, roi: List[float]) -> float:
    crop = crop_roi(image, roi).convert("RGB")
    stats = ImageStat.Stat(crop)
    r = float(stats.mean[0])
    b = float(stats.mean[2])
    return r / max(1e-6, b)


def save_failure_artifact(
    artifact_dir: pathlib.Path,
    failure_id: str,
    ref_image: Image.Image,
    cand_image: Image.Image,
    roi: List[float],
) -> str:
    artifact_dir.mkdir(parents=True, exist_ok=True)
    ref_crop = crop_roi(ref_image, roi).convert("RGB")
    cand_crop = crop_roi(cand_image, roi).convert("RGB")
    diff = ImageChops.difference(ref_crop, cand_crop)
    diff = ImageOps.autocontrast(diff.convert("L")).convert("RGB")

    width = max(ref_crop.size[0], cand_crop.size[0], diff.size[0])
    height = max(ref_crop.size[1], cand_crop.size[1], diff.size[1])
    canvas = Image.new("RGB", (width * 3, height + 24), (20, 22, 26))
    canvas.paste(ref_crop, (0, 24))
    canvas.paste(cand_crop, (width, 24))
    canvas.paste(diff, (width * 2, 24))

    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
    except Exception:
        font = ImageFont.load_default()
    draw.text((8, 4), "reference", fill=(230, 230, 230), font=font)
    draw.text((width + 8, 4), "candidate", fill=(230, 230, 230), font=font)
    draw.text((width * 2 + 8, 4), "diff", fill=(230, 230, 230), font=font)

    out_path = artifact_dir / f"{failure_id}.jpg"
    canvas.save(out_path, quality=90)
    return str(out_path)


def build_contact_sheet(
    out_dir: pathlib.Path,
    location: str,
    season: str,
    image_map: Dict[str, ResolvedImage],
    reference_entries: Dict[str, ResolvedImage],
):
    tile_w, tile_h = 320, 180
    pad = 10
    columns = ["reference"] + SKIES
    width = pad + (tile_w + pad) * len(columns)
    height = pad + (tile_h + 34 + pad) * 4 + 20
    sheet = Image.new("RGB", (width, height), (16, 18, 22))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    except Exception:
        font = ImageFont.load_default()

    draw.text((pad, 4), f"{location} {season}", fill=(235, 235, 235), font=font)

    for c, label in enumerate(columns):
        x = pad + c * (tile_w + pad)
        draw.text((x, 24), label, fill=(214, 214, 214), font=font)

    for r, segment in enumerate(SEGMENTS):
        ref_entry = reference_entries.get(segment)
        ref_x = pad
        ref_y = pad + r * (tile_h + 34 + pad) + 44
        if ref_entry is not None:
            ref_tile = ImageOps.fit(ref_entry.image.convert("RGB"), (tile_w, tile_h), Image.Resampling.LANCZOS)
            sheet.paste(ref_tile, (ref_x, ref_y))
        else:
            ImageDraw.Draw(sheet).rectangle([ref_x, ref_y, ref_x + tile_w, ref_y + tile_h], fill=(60, 24, 24))
        draw.rectangle([ref_x, ref_y, ref_x + tile_w, ref_y + tile_h], outline=(80, 84, 90), width=1)
        draw.text((ref_x, ref_y + tile_h + 5), segment, fill=(214, 214, 214), font=font)

        for c, sky in enumerate(SKIES, start=1):
            key = f"{location}_{season}_{segment}_{sky}.png"
            x = pad + c * (tile_w + pad)
            y = pad + r * (tile_h + 34 + pad) + 44
            entry = image_map.get(key)
            if entry is not None:
                tile = ImageOps.fit(entry.image.convert("RGB"), (tile_w, tile_h), Image.Resampling.LANCZOS)
                sheet.paste(tile, (x, y))
            else:
                ImageDraw.Draw(sheet).rectangle([x, y, x + tile_w, y + tile_h], fill=(60, 24, 24))
            draw.rectangle([x, y, x + tile_w, y + tile_h], outline=(80, 84, 90), width=1)
            draw.text((x, y + tile_h + 5), f"{segment}_{sky}", fill=(214, 214, 214), font=font)

    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / f"{location}-{season}-sheet.jpg"
    sheet.save(output, quality=90)


def find_local_path(key: str, search_dirs: List[pathlib.Path]) -> Optional[pathlib.Path]:
    for root in search_dirs:
        candidate = root / key
        if candidate.exists():
            return candidate
    return None


def fetch_remote_image(url: str, cache_path: pathlib.Path) -> Optional[pathlib.Path]:
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    if cache_path.exists():
        return cache_path
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read()
            cache_path.write_bytes(data)
            return cache_path
    except urllib.error.URLError:
        return None


def parse_args():
    parser = argparse.ArgumentParser(
        description="Hard-reference visual validator for seasonal/weather backgrounds."
    )
    parser.add_argument(
        "--manifest",
        default="tools/background-generation/reference-manifest.json",
        help="Reference manifest path.",
    )
    parser.add_argument(
        "--seasons",
        default="spring",
        help="Comma-separated seasons to validate (spring,summer,fall,winter).",
    )
    parser.add_argument(
        "--dirs",
        default="tools/background-generation/generated/spring-images,tools/background-generation/generated/fall-images,tools/background-generation/generated/winter-images",
        help="Comma-separated directories to search for candidate images.",
    )
    parser.add_argument(
        "--artifacts-dir",
        default="tools/background-generation/review/qa/latest",
        help="Output directory for validation artifacts.",
    )
    parser.add_argument(
        "--use-supabase",
        action="store_true",
        help="Download missing images from Supabase object URLs.",
    )
    parser.add_argument(
        "--fail-on-missing",
        action="store_true",
        help="Fail when expected candidate images are missing.",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    manifest_path = pathlib.Path(args.manifest).resolve()
    artifacts_dir = pathlib.Path(args.artifacts_dir).resolve()
    failures_dir = artifacts_dir / "roi-failures"
    sheets_dir = artifacts_dir / "sheets"
    cache_dir = artifacts_dir / ".cache"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    with open(manifest_path, "r", encoding="utf-8") as fh:
        manifest = json.load(fh)

    selected_seasons = [s.strip().lower() for s in args.seasons.split(",") if s.strip()]
    selected_seasons = [s for s in selected_seasons if s in SEASONS]
    if not selected_seasons:
        print("No valid seasons supplied.")
        return 1

    search_dirs = [
        pathlib.Path(raw.strip()).resolve()
        for raw in args.dirs.split(",")
        if raw.strip()
    ]

    thresholds = manifest["thresholds"]
    base_url = manifest["storage_base_url"].rstrip("/") + "/"
    locations = manifest["locations"]

    failures: List[ValidationFailure] = []
    resolved_trace: List[Dict[str, str]] = []
    image_map: Dict[str, ResolvedImage] = {}
    reference_map: Dict[str, ResolvedImage] = {}

    def resolve_candidate(key: str) -> Optional[ResolvedImage]:
        if key in image_map:
            return image_map[key]
        local = find_local_path(key, search_dirs)
        if local is not None:
            image = Image.open(local).convert("RGB")
            entry = ResolvedImage(key=key, source=str(local), image=image)
            image_map[key] = entry
            resolved_trace.append({"key": key, "source": str(local), "type": "candidate"})
            return entry
        if args.use_supabase:
            cache_path = cache_dir / "candidates" / key
            remote = fetch_remote_image(base_url + key, cache_path)
            if remote is not None:
                image = Image.open(remote).convert("RGB")
                entry = ResolvedImage(key=key, source=base_url + key, image=image)
                image_map[key] = entry
                resolved_trace.append({"key": key, "source": base_url + key, "type": "candidate"})
                return entry
        return None

    def resolve_reference(location_id: str, segment: str, segment_cfg: dict) -> Optional[ResolvedImage]:
        ref_key = segment_cfg["reference_key"]
        cache_key = f"{location_id}:{segment}"
        if cache_key in reference_map:
            return reference_map[cache_key]

        local = find_local_path(ref_key, search_dirs)
        source = None
        path = None
        if local is not None:
            source = str(local)
            path = local
        else:
            cache_path = cache_dir / "references" / ref_key
            remote = fetch_remote_image(base_url + ref_key, cache_path)
            if remote is not None:
                source = base_url + ref_key
                path = remote
        if path is None:
            return None

        image = Image.open(path).convert("RGB")
        entry = ResolvedImage(key=ref_key, source=source, image=image)
        reference_map[cache_key] = entry
        resolved_trace.append({"key": ref_key, "source": source, "type": "reference"})
        return entry

    # Resolve candidates and references.
    missing_candidates: List[str] = []
    for loc in locations:
        location_id = loc["id"]
        for segment in SEGMENTS:
            seg_cfg = loc["segments"][segment]
            reference = resolve_reference(location_id, segment, seg_cfg)
            if reference is None:
                failures.append(
                    ValidationFailure(
                        check="reference-missing",
                        key=f"{location_id}:{segment}",
                        message=f"Missing immutable reference {seg_cfg['reference_key']}",
                    )
                )
                continue
            for season in selected_seasons:
                for sky in SKIES:
                    key = f"{location_id}_{season}_{segment}_{sky}.png"
                    if resolve_candidate(key) is None:
                        missing_candidates.append(key)

    if args.fail_on_missing and missing_candidates:
        for key in missing_candidates:
            failures.append(
                ValidationFailure(
                    check="candidate-missing",
                    key=key,
                    message="Missing expected candidate image",
                )
            )

    # Build contact sheets.
    for loc in locations:
        for season in selected_seasons:
            reference_entries = {}
            for segment in SEGMENTS:
                ref_entry = resolve_reference(loc["id"], segment, loc["segments"][segment])
                if ref_entry is not None:
                    reference_entries[segment] = ref_entry
            build_contact_sheet(sheets_dir, loc["id"], season, image_map, reference_entries)

    # Geometry + sun checks per candidate against immutable reference.
    failure_index = 0
    for loc in locations:
        location_id = loc["id"]
        for segment in SEGMENTS:
            seg_cfg = loc["segments"][segment]
            ref = resolve_reference(location_id, segment, seg_cfg)
            if ref is None:
                continue
            geometry_roi = seg_cfg["geometry_roi"]
            horizon_roi = seg_cfg["horizon_roi"]
            expected_vec = tuple(seg_cfg.get("expected_light_vector", [0.0, 0.0]))
            ref_geo = crop_roi(ref.image, geometry_roi)
            ref_geo = ImageOps.fit(ref_geo, (320, 180), Image.Resampling.LANCZOS)
            ref_edge = edge_map_luma(ref_geo)

            ref_sun_vec = bright_centroid_vector(ref.image, horizon_roi)
            for season in selected_seasons:
                for sky in SKIES:
                    key = f"{location_id}_{season}_{segment}_{sky}.png"
                    candidate = image_map.get(key)
                    if candidate is None:
                        continue

                    cand_geo = crop_roi(candidate.image, geometry_roi)
                    cand_geo = ImageOps.fit(cand_geo, (320, 180), Image.Resampling.LANCZOS)
                    cand_edge = edge_map_luma(cand_geo)
                    _, dx, dy = best_shift_mad(ref_edge, cand_edge, max_shift=6)
                    shift_mag = math.sqrt((dx * dx) + (dy * dy))

                    if shift_mag > thresholds["geometry_max_shift_px"]:
                        failure_index += 1
                        artifact = save_failure_artifact(
                            failures_dir,
                            f"{failure_index:04d}-geometry-{key.replace('.png', '')}",
                            ref.image,
                            candidate.image,
                            geometry_roi,
                        )
                        failures.append(
                            ValidationFailure(
                                check="geometry-lock",
                                key=key,
                                message=f"Object placement drifted by {shift_mag:.2f}px",
                                metric="shift_mag_px",
                                value=shift_mag,
                                threshold=thresholds["geometry_max_shift_px"],
                                artifact=artifact,
                            )
                        )

                    if segment in ("morning", "evening"):
                        cand_sun_vec = bright_centroid_vector(candidate.image, horizon_roi)
                        if ref_sun_vec is None or cand_sun_vec is None:
                            failures.append(
                                ValidationFailure(
                                    check="sun-direction",
                                    key=key,
                                    message="Unable to estimate bright-direction vector in horizon ROI",
                                )
                            )
                        else:
                            sun_angle = angle_deg(ref_sun_vec, cand_sun_vec)
                            if sun_angle > thresholds["sun_angle_tolerance_deg"]:
                                failure_index += 1
                                artifact = save_failure_artifact(
                                    failures_dir,
                                    f"{failure_index:04d}-sun-{key.replace('.png', '')}",
                                    ref.image,
                                    candidate.image,
                                    horizon_roi,
                                )
                                failures.append(
                                    ValidationFailure(
                                        check="sun-direction",
                                        key=key,
                                        message=f"Sun highlight direction deviates from immutable reference by {sun_angle:.2f} deg",
                                        metric="sun_angle_deg",
                                        value=sun_angle,
                                        threshold=thresholds["sun_angle_tolerance_deg"],
                                        artifact=artifact,
                                    )
                                )
                            exp_mag = math.sqrt((expected_vec[0] ** 2) + (expected_vec[1] ** 2))
                            if exp_mag > 0.001:
                                dot = (cand_sun_vec[0] * expected_vec[0]) + (cand_sun_vec[1] * expected_vec[1])
                                if dot < thresholds["sun_expected_dot_min"]:
                                    failures.append(
                                        ValidationFailure(
                                            check="sun-direction",
                                            key=key,
                                            message="Sun highlight vector contradicts expected segment direction",
                                            metric="sun_expected_dot",
                                            value=float(dot),
                                            threshold=thresholds["sun_expected_dot_min"],
                                        )
                                    )

    # Sky semantics and dim-only cloudy checks.
    for loc in locations:
        location_id = loc["id"]
        for season in selected_seasons:
            for segment in SEGMENTS:
                stats_by_sky = {}
                sky_crop = {}
                seg_cfg = loc["segments"][segment]
                sky_roi = seg_cfg["sky_roi"]
                for sky in SKIES:
                    key = f"{location_id}_{season}_{segment}_{sky}.png"
                    candidate = image_map.get(key)
                    if candidate is None:
                        continue
                    stats_by_sky[sky] = sky_stats(candidate.image, sky_roi)
                    sky_crop[sky] = crop_roi(candidate.image, sky_roi).convert("L")

                if "clear" not in sky_crop:
                    continue
                if "cloudy" in sky_crop:
                    clear = sky_crop["clear"]
                    cloudy = normalize_to_luma(sky_crop["cloudy"], ImageStat.Stat(clear).mean[0])
                    structure_delta = mean_abs_diff(clear, cloudy)
                    if structure_delta < thresholds["cloudy_vs_clear_min_structure_delta"]:
                        failures.append(
                            ValidationFailure(
                                check="sky-semantics",
                                key=f"{location_id}_{season}_{segment}_cloudy.png",
                                message="Cloudy sky appears to be clear sky dimmed without structural cloud change",
                                metric="cloudy_structure_delta",
                                value=structure_delta,
                                threshold=thresholds["cloudy_vs_clear_min_structure_delta"],
                            )
                        )
                if "partly" in sky_crop:
                    clear = sky_crop["clear"]
                    partly = normalize_to_luma(sky_crop["partly"], ImageStat.Stat(clear).mean[0])
                    structure_delta = mean_abs_diff(clear, partly)
                    if structure_delta < thresholds["partly_vs_clear_min_structure_delta"]:
                        failures.append(
                            ValidationFailure(
                                check="sky-semantics",
                                key=f"{location_id}_{season}_{segment}_partly.png",
                                message="Partly sky appears too similar to clear sky",
                                metric="partly_structure_delta",
                                value=structure_delta,
                                threshold=thresholds["partly_vs_clear_min_structure_delta"],
                            )
                        )
                if "cloudy" in stats_by_sky and "dark" in stats_by_sky:
                    drop = stats_by_sky["cloudy"]["luma_mean"] - stats_by_sky["dark"]["luma_mean"]
                    if drop < thresholds["dark_min_luminance_drop"]:
                        failures.append(
                            ValidationFailure(
                                check="sky-semantics",
                                key=f"{location_id}_{season}_{segment}_dark.png",
                                message="Dark sky is not materially darker than cloudy sky",
                                metric="dark_luma_drop",
                                value=drop,
                                threshold=thresholds["dark_min_luminance_drop"],
                            )
                        )

    # Segment lighting + color temperature checks using clear variants.
    for loc in locations:
        location_id = loc["id"]
        for season in selected_seasons:
            clear_images = {}
            for segment in SEGMENTS:
                key = f"{location_id}_{season}_{segment}_clear.png"
                if key in image_map:
                    clear_images[segment] = image_map[key].image
            if set(["day", "evening", "night"]).issubset(clear_images.keys()):
                day_luma = mean_luma(clear_images["day"])
                evening_luma = mean_luma(clear_images["evening"])
                night_luma = mean_luma(clear_images["night"])

                if (day_luma - evening_luma) < thresholds["evening_day_min_luminance_drop"]:
                    failures.append(
                        ValidationFailure(
                            check="segment-lighting",
                            key=f"{location_id}_{season}_evening_clear.png",
                            message="Evening clear is too bright relative to day clear",
                            metric="day_evening_luma_drop",
                            value=(day_luma - evening_luma),
                            threshold=thresholds["evening_day_min_luminance_drop"],
                        )
                    )
                if (evening_luma - night_luma) < thresholds["night_evening_min_luminance_drop"]:
                    failures.append(
                        ValidationFailure(
                            check="segment-lighting",
                            key=f"{location_id}_{season}_night_clear.png",
                            message="Night clear is too bright relative to evening clear",
                            metric="evening_night_luma_drop",
                            value=(evening_luma - night_luma),
                            threshold=thresholds["night_evening_min_luminance_drop"],
                        )
                    )

                ref_day = resolve_reference(location_id, "day", loc["segments"]["day"])
                ref_evening = resolve_reference(location_id, "evening", loc["segments"]["evening"])
                ref_night = resolve_reference(location_id, "night", loc["segments"]["night"])
                color_tolerance = thresholds.get("color_shift_abs_tolerance", 0.22)
                ref_shift_min = thresholds.get("color_shift_min_reference_magnitude", 0.04)

                if ref_day is not None and ref_evening is not None and ref_night is not None:
                    cand_day_ratio = mean_rgb_ratio(clear_images["day"], loc["segments"]["day"]["horizon_roi"])
                    cand_evening_ratio = mean_rgb_ratio(clear_images["evening"], loc["segments"]["evening"]["horizon_roi"])
                    cand_night_ratio = mean_rgb_ratio(clear_images["night"], loc["segments"]["night"]["horizon_roi"])
                    ref_day_ratio = mean_rgb_ratio(ref_day.image, loc["segments"]["day"]["horizon_roi"])
                    ref_evening_ratio = mean_rgb_ratio(ref_evening.image, loc["segments"]["evening"]["horizon_roi"])
                    ref_night_ratio = mean_rgb_ratio(ref_night.image, loc["segments"]["night"]["horizon_roi"])

                    shift_specs = [
                        {
                            "name": "day->evening",
                            "key": f"{location_id}_{season}_evening_clear.png",
                            "cand_shift": cand_evening_ratio - cand_day_ratio,
                            "ref_shift": ref_evening_ratio - ref_day_ratio,
                            "roi": loc["segments"]["evening"]["horizon_roi"],
                            "ref_image": ref_evening.image,
                            "cand_image": clear_images["evening"],
                        },
                        {
                            "name": "evening->night",
                            "key": f"{location_id}_{season}_night_clear.png",
                            "cand_shift": cand_night_ratio - cand_evening_ratio,
                            "ref_shift": ref_night_ratio - ref_evening_ratio,
                            "roi": loc["segments"]["night"]["horizon_roi"],
                            "ref_image": ref_night.image,
                            "cand_image": clear_images["night"],
                        },
                    ]

                    for spec in shift_specs:
                        if abs(spec["ref_shift"]) < ref_shift_min:
                            continue
                        same_direction = (spec["cand_shift"] * spec["ref_shift"]) > 0
                        shift_delta = abs(spec["cand_shift"] - spec["ref_shift"])
                        if (not same_direction) or (shift_delta > color_tolerance):
                            failure_index += 1
                            artifact = save_failure_artifact(
                                failures_dir,
                                f"{failure_index:04d}-color-{spec['key'].replace('.png', '')}",
                                spec["ref_image"],
                                spec["cand_image"],
                                spec["roi"],
                            )
                            failures.append(
                                ValidationFailure(
                                    check="segment-lighting",
                                    key=spec["key"],
                                    message=(
                                        f"Color temperature shift {spec['name']} diverges from immutable reference"
                                    ),
                                    metric="color_shift_delta",
                                    value=shift_delta,
                                    threshold=color_tolerance,
                                    artifact=artifact,
                                )
                            )

    # Seasonal climate checks (snow rules).
    for loc in locations:
        location_id = loc["id"]
        for segment in SEGMENTS:
            ground_roi = loc["segments"][segment]["ground_roi"]
            for season in selected_seasons:
                for sky in SKIES:
                    key = f"{location_id}_{season}_{segment}_{sky}.png"
                    candidate = image_map.get(key)
                    if candidate is None:
                        continue
                    ratio = snow_ratio(candidate.image, ground_roi)
                    if season != "winter" and ratio > thresholds["snow_mask_ratio_max_nonwinter"]:
                        failures.append(
                            ValidationFailure(
                                check="seasonal-climate",
                                key=key,
                                message="Detected snow-like ground coverage in non-winter image",
                                metric="snow_ratio",
                                value=ratio,
                                threshold=thresholds["snow_mask_ratio_max_nonwinter"],
                            )
                        )
                    if location_id == "losangeles" and ratio > thresholds["snow_mask_ratio_max_losangeles"]:
                        failures.append(
                            ValidationFailure(
                                check="seasonal-climate",
                                key=key,
                                message="Detected snow-like ground coverage in Los Angeles image",
                                metric="snow_ratio",
                                value=ratio,
                                threshold=thresholds["snow_mask_ratio_max_losangeles"],
                            )
                        )

    # NYC hard rule: no cars in the protected walkway ROI for any segment/season.
    nyc = [loc for loc in locations if loc["id"] == "nyc"]
    if nyc:
        nyc = nyc[0]
        for segment in SEGMENTS:
            seg_cfg = nyc["segments"][segment]
            car_roi = seg_cfg.get("car_forbidden_roi")
            if not car_roi:
                continue
            reference = resolve_reference("nyc", segment, seg_cfg)
            if reference is None:
                continue
            ref_crop = crop_roi(reference.image, car_roi).convert("L")
            ref_edge = edge_map_luma(ImageOps.fit(ref_crop, (260, 160), Image.Resampling.LANCZOS))
            for season in SEASONS:
                for sky in SKIES:
                    key = f"nyc_{season}_{segment}_{sky}.png"
                    candidate = image_map.get(key)
                    if candidate is None:
                        continue
                    cand_crop = crop_roi(candidate.image, car_roi).convert("L")
                    cand_crop = ImageOps.fit(cand_crop, (260, 160), Image.Resampling.LANCZOS)
                    cand_mean = float(ImageStat.Stat(cand_crop).mean[0])
                    ref_mean = float(ImageStat.Stat(ref_crop).mean[0])
                    if cand_mean > 1e-6:
                        cand_crop = ImageEnhance.Brightness(cand_crop).enhance(ref_mean / cand_mean)
                    cand_edge = edge_map_luma(cand_crop)
                    diff_score = mean_abs_diff(ref_edge, cand_edge)
                    if diff_score > thresholds["nyc_car_roi_diff_max"]:
                        failure_index += 1
                        artifact = save_failure_artifact(
                            failures_dir,
                            f"{failure_index:04d}-nyc-car-{key.replace('.png', '')}",
                            reference.image,
                            candidate.image,
                            car_roi,
                        )
                        failures.append(
                            ValidationFailure(
                                check="nyc-no-car-hard-rule",
                                key=key,
                                message="NYC protected walkway ROI diverges from no-car reference anchor",
                                metric="car_roi_edge_diff",
                                value=diff_score,
                                threshold=thresholds["nyc_car_roi_diff_max"],
                                artifact=artifact,
                            )
                        )

    # Report outputs.
    report = {
        "status": "pass" if not failures else "fail",
        "seasons": selected_seasons,
        "candidate_count": len([k for k in image_map.keys() if any(f"_{s}_" in k for s in selected_seasons)]),
        "missing_candidates": missing_candidates,
        "failure_count": len(failures),
        "failures": [f.to_dict() for f in failures],
    }

    report_path = artifacts_dir / "qa-report.json"
    with open(report_path, "w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2)

    csv_path = artifacts_dir / "qa-failures.csv"
    with open(csv_path, "w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=["check", "key", "message", "metric", "value", "threshold", "artifact"],
        )
        writer.writeheader()
        for failure in failures:
            writer.writerow(failure.to_dict())

    trace_path = artifacts_dir / "resolved-key-trace.log"
    with open(trace_path, "w", encoding="utf-8") as fh:
        for entry in resolved_trace:
            fh.write(f"[{entry['type']}] {entry['key']} -> {entry['source']}\n")

    print("Visual QA Results")
    print(f"- seasons: {', '.join(selected_seasons)}")
    print(f"- candidates loaded: {report['candidate_count']}")
    print(f"- missing candidates: {len(missing_candidates)}")
    print(f"- failures: {len(failures)}")
    print(f"- report: {report_path}")
    print(f"- csv: {csv_path}")
    print(f"- trace: {trace_path}")
    print(f"- sheets: {sheets_dir}")
    print(f"- roi failures: {failures_dir}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())

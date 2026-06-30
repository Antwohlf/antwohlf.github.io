#!/usr/bin/env python3

import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


DEFAULT_LOCATIONS = ["detroit", "annarbor", "nyc", "sansebastian"]
SEGMENTS = ["morning", "day", "evening", "night"]


def parse_args():
    parser = argparse.ArgumentParser(
        description="Create a background approval contact sheet."
    )
    parser.add_argument("--season", default="summer")
    parser.add_argument(
        "--locations",
        default=",".join(DEFAULT_LOCATIONS),
        help="Comma-separated location ids.",
    )
    parser.add_argument(
        "--skies",
        default="clear",
        help="Comma-separated sky variants. Use clear,partly,cloudy,dark for weather review.",
    )
    parser.add_argument(
        "--dir",
        default="",
        help="Candidate directory. Defaults to tools/background-generation/generated/<season>-active-<sky-or-all>.",
    )
    parser.add_argument(
        "--out",
        default="",
        help="Output path. Defaults to output/<season>-approval-contact-sheet.png.",
    )
    return parser.parse_args()


def split_csv(value):
    return [item.strip().lower() for item in value.split(",") if item.strip()]


def load_font(size):
    for path in [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def main():
    args = parse_args()
    season = args.season.strip().lower()
    locations = split_csv(args.locations)
    skies = split_csv(args.skies)
    sky_dir = skies[0] if len(skies) == 1 else "all"
    source_dir = Path(args.dir) if args.dir else Path(f"tools/background-generation/generated/{season}-active-{sky_dir}")
    output_path = Path(args.out) if args.out else Path(f"output/{season}-approval-contact-sheet.png")

    missing = []
    files = []
    for location in locations:
        for sky in skies:
            for segment in SEGMENTS:
                path = source_dir / f"{location}_{season}_{segment}_{sky}.png"
                if not path.exists():
                    missing.append(str(path))
                files.append((location, segment, sky, path))

    if missing:
        raise SystemExit("Missing background image(s):\n" + "\n".join(missing))

    thumb_w = 480
    thumb_h = 270
    label_h = 34
    cols = len(SEGMENTS)
    rows = len(locations) * len(skies)
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "black")
    draw = ImageDraw.Draw(sheet)
    font = load_font(18)

    for index, (location, segment, sky, path) in enumerate(files):
        row = index // cols
        col = index % cols
        x = col * thumb_w
        y = row * (thumb_h + label_h)
        try:
            image = Image.open(path).convert("RGB")
        except OSError as error:
            raise SystemExit(f"Could not read image {path}: {error}") from error
        image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        frame = Image.new("RGB", (thumb_w, thumb_h), "black")
        frame.paste(image, ((thumb_w - image.width) // 2, (thumb_h - image.height) // 2))
        sheet.paste(frame, (x, y + label_h))
        label = f"{location} / {season} / {segment} / {sky}"
        draw.rectangle((x, y, x + thumb_w, y + label_h), fill=(20, 20, 20))
        draw.text((x + 12, y + 8), label, fill=(255, 255, 255), font=font)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path)
    print(output_path)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Export public Supabase Storage objects from a checked inventory manifest."""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
from pathlib import Path, PurePosixPath
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


def export_object(item: dict, destination: Path, public_base_url: str) -> dict:
    key = item["name"]
    parts = PurePosixPath(key).parts
    if not parts or key.startswith("/") or any(part in (".", "..") for part in parts):
        raise ValueError(f"Unsafe object key: {key!r}")

    output = destination / "objects" / Path(*parts)
    output.parent.mkdir(parents=True, exist_ok=True)
    expected_bytes = int(item["bytes"])
    expected_etag = (item.get("etag") or "").strip('"')

    for attempt in range(4):
        partial = output.with_name(output.name + ".part")
        sha256 = hashlib.sha256()
        md5 = hashlib.md5()
        actual_bytes = 0
        try:
            request = Request(
                f"{public_base_url}/{quote(key, safe='/')}",
                headers={"User-Agent": "personal-website-storage-export/1.0"},
            )
            with urlopen(request, timeout=45) as response, partial.open("wb") as target:
                for chunk in iter(lambda: response.read(1024 * 1024), b""):
                    target.write(chunk)
                    sha256.update(chunk)
                    md5.update(chunk)
                    actual_bytes += len(chunk)

            if actual_bytes != expected_bytes:
                raise ValueError(f"Size mismatch for {key}: {actual_bytes} != {expected_bytes}")
            if expected_etag and "-" not in expected_etag and md5.hexdigest() != expected_etag:
                raise ValueError(f"ETag mismatch for {key}")

            partial.replace(output)
            return {
                "object_key": key,
                "local_path": str(output.relative_to(destination)),
                "bytes": actual_bytes,
                "sha256": sha256.hexdigest(),
                "md5": md5.hexdigest(),
                "source_etag": expected_etag,
                "mime_type": item.get("mime_type"),
            }
        except (HTTPError, URLError, TimeoutError, OSError, ValueError):
            partial.unlink(missing_ok=True)
            if attempt == 3:
                raise
            time.sleep(2**attempt)

    raise AssertionError("unreachable")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inventory", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    inventory = json.loads(args.inventory.read_text())
    items = [item for item in inventory["files"] if not item["name"].startswith("backgrounds/")]
    public_base_url = (
        f"https://{inventory['project_id']}.supabase.co/storage/v1/object/public/"
        f"{quote(inventory['bucket'])}"
    )
    args.destination.mkdir(parents=True, exist_ok=True)

    exported = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(export_object, item, args.destination, public_base_url): item["name"]
            for item in items
        }
        for future in as_completed(futures):
            exported.append(future.result())

    exported.sort(key=lambda item: item["object_key"])
    result = {
        "project_id": inventory["project_id"],
        "bucket": inventory["bucket"],
        "files": exported,
        "total_files": len(exported),
        "total_bytes": sum(item["bytes"] for item in exported),
    }
    (args.destination / "other-manifest.json").write_text(json.dumps(result, indent=2) + "\n")
    print(f"Exported and verified {result['total_files']} objects, {result['total_bytes']} bytes")


if __name__ == "__main__":
    main()

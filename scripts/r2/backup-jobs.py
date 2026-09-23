#!/usr/bin/env python3
"""Export the public.jobs table through PostgREST with counts and SHA-256 checks.

The data export is intended as a portable fallback when a direct pg_dump
connection is unavailable. Paginated HTTP reads are not a transactionally
consistent database snapshot; prefer pg_dump for recurring production backups.
"""

import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path
import tempfile
import urllib.parse
import urllib.request
from datetime import datetime, timezone


def load_env(path):
    if not path:
        return
    for line in Path(path).read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.strip().strip("\"'")
        os.environ.setdefault(key.strip(), value)


def get(url, key, params=None, method="GET"):
    query = urllib.parse.urlencode(params or {})
    target = url.rstrip("/") + "/rest/v1/jobs" + ("?" + query if query else "")
    request = urllib.request.Request(
        target,
        method=method,
        headers={"apikey": key, "Authorization": "Bearer " + key,
                 "Prefer": "count=exact", "Accept": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read(), response.headers


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", help="Local .env file containing Supabase credentials")
    parser.add_argument("--out-dir", required=True)
    args = parser.parse_args()
    load_env(args.env_file)
    url = os.getenv("SUPABASE_URL") or os.getenv("JOBS_SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("JOBS_SUPABASE_ANON_KEY")
    if not url or not key:
        raise SystemExit("SUPABASE_URL and a service-role or jobs anon key are required")
    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    count_headers = get(url, key, {"select": "url", "limit": "1"}, "HEAD")[1]
    expected = int(count_headers["Content-Range"].split("/")[-1])
    cursor = None
    seen_urls = set()
    count = 0
    first_url = None
    last_url = None
    digest = hashlib.sha256()
    fd, temp_name = tempfile.mkstemp(prefix="jobs-", suffix=".jsonl.gz", dir=out_dir)
    os.close(fd)
    try:
        with open(temp_name, "wb") as raw, gzip.GzipFile(fileobj=raw, mode="wb", mtime=0) as compressed:
            while True:
                params = {"select": "*", "order": "url.asc", "limit": "500"}
                if cursor is not None:
                    params["url"] = "gt." + cursor
                body, _ = get(url, key, params)
                rows = json.loads(body)
                if not rows:
                    break
                for row in rows:
                    row_url = row["url"]
                    if row_url in seen_urls:
                        raise RuntimeError("The export returned a duplicate URL")
                    seen_urls.add(row_url)
                    encoded = (json.dumps(row, sort_keys=True, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
                    compressed.write(encoded)
                    digest.update(encoded)
                    first_url = first_url or row_url
                    last_url = row_url
                    cursor = row_url
                    count += 1
                print(f"Exported {count}/{expected} rows", flush=True)
                if len(rows) < 500:
                    break
        final_count = int(get(url, key, {"select": "url", "limit": "1"}, "HEAD")[1]["Content-Range"].split("/")[-1])
        if count != expected or count != final_count:
            raise RuntimeError(f"Row count changed during export: before={expected}, exported={count}, after={final_count}")
        archive = out_dir / "jobs.jsonl.gz"
        os.replace(temp_name, archive)
        manifest = {
            "created_at": datetime.now(timezone.utc).isoformat(),
            "project_id": urllib.parse.urlparse(url).hostname.split(".")[0],
            "table": "public.jobs", "rows": count,
            "jsonl_sha256": digest.hexdigest(),
            "archive_sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
            "archive_bytes": archive.stat().st_size,
            "first_url": first_url, "last_url": last_url,
            "consistency": "best-effort PostgREST pagination; use pg_dump for a transactional snapshot",
        }
        (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        print(f"Verified export: {count} rows, {archive.stat().st_size} compressed bytes")
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)


if __name__ == "__main__":
    main()

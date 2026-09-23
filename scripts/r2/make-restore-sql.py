#!/usr/bin/env python3
"""Validate a jobs export and emit a PostgreSQL restore script."""

import argparse
import gzip
import hashlib
import json
from pathlib import Path

EXPECTED_COLUMNS = {
    "url", "title", "company", "location", "first_seen", "last_seen", "is_active",
    "description", "description_updated_at", "source_job_id", "normalized_locations",
    "workplace_types", "remote_scope", "remote_eligibility", "location_parse_status",
    "location_normalization_version",
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("backup_dir")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    backup = Path(args.backup_dir)
    manifest = json.loads((backup / "manifest.json").read_text())
    archive = (backup / "jobs.jsonl.gz").read_bytes()
    if hashlib.sha256(archive).hexdigest() != manifest["archive_sha256"]:
        raise SystemExit("Archive checksum mismatch")
    data = gzip.decompress(archive)
    if hashlib.sha256(data).hexdigest() != manifest["jsonl_sha256"]:
        raise SystemExit("JSONL checksum mismatch")
    rows = [json.loads(line) for line in data.splitlines()]
    if len(rows) != manifest["rows"] or len({row["url"] for row in rows}) != len(rows):
        raise SystemExit("Row count or unique URL validation failed")
    if any(set(row) != EXPECTED_COLUMNS for row in rows):
        raise SystemExit("The jobs table columns changed; update jobs-schema.sql before backing up")
    output = Path(args.output)
    with output.open("w") as sql:
        sql.write("\\set ON_ERROR_STOP on\nBEGIN;\n")
        for start in range(0, len(rows), 100):
            payload = json.dumps(rows[start:start + 100], ensure_ascii=False, separators=(",", ":"))
            delimiter = f"$jobs_backup_{start}$"
            if delimiter in payload:
                raise SystemExit("Dollar delimiter collision")
            sql.write(f"INSERT INTO public.jobs SELECT * FROM jsonb_populate_recordset(NULL::public.jobs, {delimiter}{payload}{delimiter}::jsonb);\n")
        sql.write("COMMIT;\n")
    print(f"Wrote restorable SQL for {len(rows)} jobs: {output}")


if __name__ == "__main__":
    main()

# Local Asset Mirror

Use this workflow to inspect the site with local asset copies.

Production uses `https://assets.anthonywohlfeil.com/`. The legacy script path
is retained for existing local commands; it now mirrors the public R2 object
list in `scripts/r2/public-keys.json`. Original PNGs are copied from the
verified local master backup when present.

## Mirror Assets

Dry-run/report only, no network:

```bash
node scripts/supabase/mirror-public-assets.mjs
```

Copy anything already present in local backups and download missing public files from R2:

```bash
node scripts/supabase/mirror-public-assets.mjs --download
```

Mirror just the backgrounds, including the published WebPs and any local PNG
masters:

```bash
node scripts/supabase/mirror-public-assets.mjs --scope=backgrounds --download
```

Search an extra local folder before downloading:

```bash
node scripts/supabase/mirror-public-assets.mjs --local-root=/Users/anthony/Downloads
```

Existing mirrored files are skipped. Use `--force` only when you intentionally want to refresh from local backups/R2. Private PNG masters cannot be fetched through the public R2 hostname; restore them from the private bucket or the verified local backup first.

## Switch Local Dev To The Mirror

```bash
node scripts/supabase/switch-asset-source.mjs local
```

If you only need to debug rotating backgrounds, avoid touching gallery/project images:

```bash
node scripts/supabase/switch-asset-source.mjs local --scope=backgrounds
```

Serve the repo root locally, for example:

```bash
python3 -m http.server 8080
```

## Restore Production URLs

Before committing/pushing production site files:

```bash
node scripts/supabase/switch-asset-source.mjs remote
```

Production should not point at `/dev-assets/...`.

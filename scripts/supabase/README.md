# Supabase Asset Mirror

Use this workflow to keep development from burning Supabase cached egress.

Production should use Supabase URLs. Local development can switch the same files to a local mirror.

## Mirror Assets

Dry-run/report only, no network:

```bash
node scripts/supabase/mirror-public-assets.mjs
```

Copy anything already present in local backups and download only missing files from Supabase:

```bash
node scripts/supabase/mirror-public-assets.mjs --download
```

By default, background mirroring includes original time-of-day backgrounds and
currently live clear seasonal assets for active locations. When weather variants
are ready, include the full sky matrix:

```bash
node scripts/supabase/mirror-public-assets.mjs --scope=backgrounds --include-weather-matrix --download
```

Search an extra local folder before downloading:

```bash
node scripts/supabase/mirror-public-assets.mjs --local-root=/Users/anthony/Downloads
```

Existing mirrored files are skipped. Use `--force` only when you intentionally want to refresh from local backups/Supabase.

## Switch Local Dev To The Mirror

```bash
node scripts/supabase/switch-asset-source.mjs local
```

If you only need to debug rotating backgrounds, avoid touching gallery/project images:

```bash
node scripts/supabase/switch-asset-source.mjs local --scope=backgrounds
```

When actively debugging weather variants, require the full local weather mirror
before switching:

```bash
node scripts/supabase/switch-asset-source.mjs local --scope=backgrounds --include-weather-matrix
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

# R2 image migration runbook

The website serves 407 public objects from `https://assets.anthonywohlfeil.com/`:
264 versioned WebP backgrounds and 143 other images/files. The 264 PNG masters
belong in a separate private R2 bucket. Never make the masters public.

## R2 setup

Use Standard storage. Create separate public assets and private masters buckets.
Attach the hostname above to the public bucket in the same
Cloudflare account as the domain. Configure its CORS policy for
`https://anthonywohlfeil.com` and `https://www.anthonywohlfeil.com` with GET and
HEAD. Versioned WebPs are uploaded with a one-year immutable cache header.
Use bucket-scoped R2 API credentials, kept only in local `.env` or deployment
secrets. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_PUBLIC_BUCKET`, and `R2_PRIVATE_BUCKET`, then run:

```sh
npm ci --prefix scripts/r2
```

## One-time verified migration

The three ignored manifests and their files must be present on the Mac. The
`export-supabase-public.py` script created the third manifest from the live
Supabase inventory. Run dry-run before any upload:

```sh
node scripts/r2/sync-verified-assets.mjs \
  --original-manifest=tools/background-generation/backups/supabase-seasonal-2026-09-09/manifest.json \
  --webp-manifest=tools/background-generation/generated/static-backgrounds-20260909/manifest.json \
  --other-manifest=tools/background-generation/backups/supabase-full-2026-09-23/other-manifest.json \
  --mode=dry-run
```

Replace `--mode=dry-run` with `--mode=upload`, then run again with
`--mode=verify`. The tool checks every local file before uploading, preserves
the original object keys, and reads every R2 object back to compare SHA-256,
length, and MIME type. Uploads are restartable. Do not change the website until
all 671 objects verify.

After the public bucket is configured, test a WebP, gallery JPEG, and PDF with
ordinary HTTPS GETs through the custom domain. Test a browser `fetch()` from
the website origin to confirm CORS. Confirm the masters bucket has no public
hostname or `r2.dev` access.

## Future background releases

Upload approved PNGs to the private masters bucket with
`upload-selected-backgrounds.mjs`. Keep a SHA-256 local manifest. Encode a
complete WebP set with `build-static-backgrounds.py`, using a **new**
`backgrounds/static-YYYYMMDD/` prefix, then upload it with
`upload-static-backgrounds.mjs`. That script refuses to overwrite a versioned
object with different bytes and updates `public-keys.json`. Commit the changed
key list and website asset prefix together. The visual validator expects local
PNG references from the verified master backup or a private R2 restore.

The legacy `scripts/supabase/` mirror commands now read public R2; their
directory names are retained for compatibility. The mirror may also copy
private PNG originals from the ignored local backup for local review.

## Rollback and retirement

Keep Supabase's public objects during the website cutover. A rollback can
redeploy the previous GitHub Pages revision while those objects remain. After
live requests are verified against R2, delete the 264 old PNG masters from
Supabase in reviewed batches. Keep the 407 public objects for the agreed
rollback window. Remove them only after checking old clients and the live site
no longer request Supabase Storage. `jobs` stays in the existing Supabase
project; do not delete that project when downgrading the organization.

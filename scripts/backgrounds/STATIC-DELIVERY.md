# Static background delivery

The production site uses full-resolution WebP objects under a versioned
`backgrounds/static-20260927-quality-v2/` prefix. CSS performs the only viewport crop.
These copies use WebP quality 92; original PNG masters remain in a private R2
bucket and the local backup. The website serves the public R2 custom domain.

The September 27 release activates all 256 reviewed combinations: four cities,
four seasons, four times, and four skies. It includes the September 13 NYC fall
rebuild. PNG deliveries and native generated originals are archived separately
under `backgrounds/releases/20260927-quality-v2/` in the private masters bucket.
The older public prefix and private masters remain available for rollback.

For a complete reviewed release:

```sh
python3 scripts/backgrounds/build-reviewed-release.py \
  --source=/absolute/path/to/generated/seasons-2026-r2 \
  --out=/absolute/path/to/generated/release-YYYYMMDD-quality-vN \
  --release=YYYYMMDD-quality-vN
node scripts/backgrounds/publish-reviewed-release.mjs /absolute/path/to/release.json
node scripts/backgrounds/verify-public-release.mjs /absolute/path/to/release.json
node scripts/backgrounds/test-seasonal-selection.mjs /absolute/path/to/release.json
```

The builder verifies the entire reviewed matrix and source hashes before
encoding. Publishing verifies every object by remote GET and SHA-256, including
the private PNGs and portable archive manifest. The public check reads all 256
WebPs through the custom domain and verifies content, MIME, caching and CORS.
The selector test exercises every production combination against those files.
Install the pinned R2 dependencies and supply the environment variables below.

After verification, commit the new public-key inventory, production prefix,
browser cache name, and script version together. The upload does not itself
activate the website. Keep the generated manifests and verification evidence
alongside the local release; generated imagery stays out of Git.

The older backup-based workflow remains available for partial sets:

1. Upload approved canonical PNGs to the private R2 bucket and back up current hosted backgrounds with
   a manifest containing `files`: `local_path`, `object_key`, `sha256`, `bytes`.
   Local paths are relative to the backup root. Backups belong in the ignored
   `tools/background-generation/backups/` directory.
2. Encode a complete resident set (including legacy fallback images):

   ```sh
   python3 scripts/backgrounds/build-static-backgrounds.py \
     --backup=tools/background-generation/backups/supabase-seasonal-2026-09-09 \
     --out=tools/background-generation/generated/static-backgrounds-20260909 \
     --prefix=backgrounds/static-20260909
   ```

   Use a new versioned prefix for future releases. Pillow is required. Encoding
   preserves dimensions and composition; no relighting or image generation occurs.
3. Upload and verify the resulting files:

   ```sh
   node scripts/backgrounds/upload-static-backgrounds.mjs \
     tools/background-generation/generated/static-backgrounds-20260909/manifest.json
   ```

   Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `R2_PUBLIC_BUCKET`, and `R2_PRIVATE_BUCKET` in `.env` or the shell. Install
   dependencies with `npm ci --prefix scripts/r2`. The script checks MD5 locally
   and compares SHA-256 of every hosted object after upload. Never overwrite a
   versioned key with different content; publish under a new prefix.
4. Only after all files verify, update `staticBackgroundBaseUrl`, the browser
   cache name, and the script version in `index.html`. Validate each season's
   approved routes and fallback routes before publishing.

Do not remove a source or static prefix until its local backup is verified and
no deployed runtime references it. All four seasons remain available year-round;
the calendar selects the appropriate season. The September 27 release restores
weather-specific winter images for all four active cities.

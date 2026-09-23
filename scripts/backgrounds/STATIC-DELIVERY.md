# Static background delivery

The production site uses full-resolution WebP objects under a versioned
`backgrounds/static-20260909/` prefix. CSS performs the only viewport crop.
These copies use WebP quality 92; original PNG masters remain in a private R2
bucket and the local backup. The website serves the public R2 custom domain.

For the next approved background release:

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
no deployed runtime references it. The calendar switches to fall September 22.
Keep summer available until then. Winter canonical objects were retired in June;
production uses its existing nonseasonal fallback for unapproved seasons.

# Static background delivery

The production site uses full-resolution WebP objects under a versioned
`backgrounds/static-20260909/` prefix. CSS performs the only viewport crop.
These copies use WebP quality 92; original PNG masters remain available.
Serving ordinary Storage object URLs avoids the distinct-origin-image quota
of Supabase's image transformation endpoint. Do not restore `/render/image/`
URLs without reviewing that allowance (Pro includes 100 origins per cycle).

For the next approved background release:

1. Upload approved canonical PNGs and back up current hosted backgrounds with
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

   Credentials come from `.env` via `shared.mjs`. Checksums are checked locally
   before upload and against every hosted object's ETag afterward.
4. Only after all files verify, update `staticBackgroundBaseUrl`, the browser
   cache name, and the script version in `index.html`. Validate each season's
   approved routes and fallback routes before publishing.

Do not remove a source or static prefix until its local backup is verified and
no deployed runtime references it. The calendar switches to fall September 22.
Keep summer available until then. Winter canonical objects were retired in June;
production uses its existing nonseasonal fallback for unapproved seasons.

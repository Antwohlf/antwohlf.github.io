# Reviewed seasonal background release

The September 23 hosting migration copied the existing published artwork.
The September 27 release activates the newer local quality-pass set, including
the rebuilt NYC fall images. It covers all 256 combinations of Detroit, Ann
Arbor, New York and San Sebastián; spring, summer, fall and winter; morning,
day, evening and night; clear, partly cloudy, cloudy and dark skies.

## Release identity

- Source set: `seasons-2026-r2` (revision two, unrelated to the Cloudflare product name).
- Reviewed source manifest SHA-256: `36ad7edca51e078b6ffab23d6ef8b5fd9caea93fce9898688d2247e7bb2c164d`.
- Public bucket: `anthonywohlfeil-assets`.
- Public prefix: `backgrounds/static-20260927-quality-v2/`.
- Private bucket: `anthonywohlfeil-background-masters`.
- Private archive: `backgrounds/releases/20260927-quality-v2/`, with 256 delivery
  PNGs, 256 native originals, and a portable SHA-256 manifest.
- Delivery WebPs: 2816×1536, quality 92, encoded from the reviewed delivery PNGs.
  Native originals retain their actual dimensions; delivery enlargement does
  not add native resolution.

## Activation and validation

All four seasons now use the full weather-specific set. This removes the old
spring restrictions and winter fallback to nonseasonal artwork. The asset
prefix, browser cache name, and script URL version change together so existing
visitors request the new files.

The release pipeline checks all 256 source delivery hashes and native review
hashes. Upload verification reads every Cloudflare object back and compares its
SHA-256, size and MIME type. Public verification reads all 256 WebPs through the
website asset hostname and checks CORS and immutable cache headers. The selector
test exercises all 256 combinations against the release manifest, including
missing-weather fallback and calendar/time selection.

Local release artifacts are under the ignored
`tools/background-generation/generated/release-20260927-quality-v2/` directory.
The portable manifest is also stored with the private archive. Existing image
reviews and generation attempts remain local and unchanged.
The checked-in hash catalog is
`scripts/backgrounds/releases/20260927-quality-v2.json` and identifies the
delivery PNG, native original and published WebP for every combination.

Before activation, all 769 new objects passed remote SHA-256 readback and all
256 public WebPs passed the custom-domain checks. Cloudflare inventory confirmed
663 public objects and 777 private objects; all 671 pre-release objects retained
their original sizes and ETags. One stalled verification read was canceled and
completed successfully after adding connection/socket timeouts. No image needed
regeneration or replacement during publication.

## Rollback

The previous `backgrounds/static-20260909/` objects and original private master
keys are retained. Revert the activation commit to restore the old published
set. The unrelated 143 public images and documents are unchanged. This release
does not alter Supabase or the separate jobs database.

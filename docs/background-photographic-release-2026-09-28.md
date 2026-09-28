# Seasonal photographic reconstruction release

Release `20260928-photographic-v3` replaces 192 backgrounds for Detroit, New York City and San Sebastián across four seasons, four times of day and four weather conditions. Ann Arbor's 64 approved originals retain their `static-20260927-quality-v2` URLs. All 256 originals (768 native PNG, delivery PNG and published WebP files) are preserved in the local checksum-verified backup, pending explicit permission to delete.

The replacements reconstruct materials from composition guides and photographic references rather than repeatedly relighting textured generated images. Native reviews addressed patterned foliage and surfaces, northern winter snow, coastal lighting, sunrise/sunset directions, distinct cloudy conditions and believable night illumination. The intended color treatment is modestly richer natural saturation. These remain AI-generated scenes, not documentary photographs.

## Asset selection

The local release directory is `tools/background-generation/generated/release-20260928-photographic-v3/` in the primary checkout. Its `manifest.json` binds every exported WebP to an approved native SHA-256; `publication.json` binds upload destinations and checksums. The generation manifest and three final city matrix reviews are bound by `seasons-2026-r3/review/final-acceptance.json`.

The WebP files use quality 95 at native resolution (approximately 1698 × 926, varying by a pixel). There is no enlargement, sharpening or post-generation recoloring. Delivery PNG and native PNG are identical. Reference attribution is published in `/background-credits.html`.

Public objects use new immutable keys under `backgrounds/static-20260928-photographic-v3/`. Private objects under `backgrounds/releases/20260928-photographic-v3/` preserve native and delivery PNGs, the archive manifest, and a provenance archive containing selected prompts, referenced source images and review evidence. Retained Ann Arbor objects are never rewritten by the publisher.

## Release gates

- Local preflight checks every upload's hash and size before the first write.
- R2 uploads are followed by a full authenticated GET checksum/MIME/size check.
- Public-domain verification must check all 256 selected files, including retained Ann Arbor files, for checksum, length, MIME, immutable caching and website CORS.
- The actual JavaScript selector must pass all 256 routes, season boundaries, time segments and missing-weather fallback.
- Browser checks and production activation verification remain separate gates; successful native reviews or uploads alone do not prove a completed deployment.

Existing single-image pilot drafts and the release worktree's pre-existing changes were copied to `backups/20260928-release-worktree-before-full-release/` before preparing this full release. No historical cloud objects are deleted.

# Background Prompt Pipeline

This folder stores reusable prompt specifications and manifests for seasonal
background generation. It should contain source code, prompt specs, and metadata
only. Generated images, review sheets, Supabase backups, and QA output are local
artifacts and are ignored by git.

Prompt payloads are written for manual use with Codex built-in image generation;
they are not tied to a paid external image API key.

## Inputs

- `source-manifest.json`: canonical reference image URLs and storage keys.
- `prompt-specs.json`: shared style rules, seasonal rules, sky variants, and
  per-location composition constraints.

## Build Clear Seasonal Prompts

```bash
node tools/background-generation/build-prompts.mjs \
  --seasons=fall \
  --locations=detroit,annarbor,nyc,sansebastian \
  --skies=clear \
  --reference-mode=manifest \
  --out=tools/background-generation/generated/prompts-fall-active-clear.json
```

This writes 16 prompts for the four active locations, four time segments, and
one clear sky variant.

## Build Weather Prompts

```bash
node tools/background-generation/build-prompts.mjs \
  --seasons=fall \
  --locations=detroit,annarbor,nyc,sansebastian \
  --skies=clear,partly,cloudy,dark \
  --reference-mode=seasonal-clear \
  --out=tools/background-generation/generated/prompts-fall-weather.json
```

This writes 64 prompts for one season across the active locations, time
segments, and supported sky variants.

Use `--reference-mode=seasonal-clear` for weather prompts. That makes each
weather variant use the already-approved clear image for the same season,
location, and time segment as its composition anchor.

## Candidate Filenames

Use canonical names so review, upload, and runtime code can reason about assets:

```text
{location}_{season}_{segment}_{sky}.png
```

Example:

```text
nyc_fall_evening_cloudy.png
```

Do not commit generated candidate images. Keep them under
`tools/background-generation/generated/` until manually approved and uploaded to
Supabase.

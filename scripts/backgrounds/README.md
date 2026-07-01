# Background Rollout Scripts

These scripts support seasonal background rollouts without committing generated
images or review artifacts. Production assets live in Supabase. Local generated
files, contact sheets, mirrors, backups, and QA output are ignored by git.

## Current Seasonal Review Flow

Build prompt payloads from the shared prompt specs:

```bash
node tools/background-generation/build-prompts.mjs \
  --seasons=fall \
  --locations=detroit,annarbor,nyc,sansebastian \
  --skies=clear \
  --reference-mode=manifest \
  --out=tools/background-generation/generated/prompts-fall-active-clear.json
```

Generate candidates with image generation and save them with canonical names:

```text
tools/background-generation/generated/fall-active-clear/
  detroit_fall_morning_clear.png
  ...
```

Normalize candidates to the website hero canvas:

```bash
python3 scripts/backgrounds/normalize-candidates.py \
  --dir=tools/background-generation/generated/fall-active-clear \
  --season=fall \
  --locations=detroit,annarbor,nyc,sansebastian \
  --skies=clear
```

Create the manual approval contact sheet:

```bash
python3 scripts/backgrounds/create-approval-contact-sheet.py \
  --season=fall \
  --locations=detroit,annarbor,nyc,sansebastian \
  --skies=clear \
  --dir=tools/background-generation/generated/fall-active-clear \
  --out=output/fall-approval-contact-sheet.png
```

Upload only after the complete approved set is ready:

```bash
node scripts/backgrounds/upload-selected-backgrounds.mjs \
  tools/background-generation/generated/fall-active-clear/*_fall_*_clear.png
```

Then update the approval gate in `assets/js/backgrounds.js` so production starts
requesting the uploaded season.

## Weather Extension

Weather variants use the same scripts with multiple sky values. Rain, snow, fog,
and storm are CSS overlays in the website runtime, not separate generated image
families:

```bash
node tools/background-generation/build-prompts.mjs \
  --seasons=fall \
  --locations=detroit,annarbor,nyc,sansebastian \
  --skies=clear,partly,cloudy,dark \
  --reference-mode=seasonal-clear \
  --out=tools/background-generation/generated/prompts-fall-weather.json
```

Use `--reference-mode=seasonal-clear` for weather passes so each generated sky
variant anchors to the approved `location_season_time_clear.png` image for the
same location and time segment. Use `--reference-mode=manifest` for first-pass
clear seasonal generation from the original source references.

Use the canonical naming pattern:

```text
{location}_{season}_{morning|day|evening|night}_{clear|partly|cloudy|dark}.png
```

Keep weather generated assets local until the full approved matrix is ready.
Weather approval is per location: a location needs all four time segments and all
four sky variants approved before production can request non-clear weather
backgrounds for that location. Until then, production falls back to the approved
clear seasonal image, then to the original `location_time.png` image.

## Legacy Helpers

The older preflight, validator, migration, and release-gate scripts are retained
because they may be useful for weather QA, Supabase inventory checks, or future
hard-reference validation. They are not the default upload path for the current
manual approval workflow.

#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const args = process.argv.slice(2);
const seasonsArg = args.find((arg) => arg.startsWith('--seasons='));
const outputArg = args.find((arg) => arg.startsWith('--out='));
const locationsArg = args.find((arg) => arg.startsWith('--locations='));
const skiesArg = args.find((arg) => arg.startsWith('--skies='));
const referenceModeArg = args.find((arg) => arg.startsWith('--reference-mode='));
const seasons = (seasonsArg ? seasonsArg.slice('--seasons='.length) : 'spring')
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);
const requestedLocations = locationsArg
  ? locationsArg.slice('--locations='.length).split(',').map((value) => value.trim().toLowerCase()).filter(Boolean)
  : [];
const requestedSkies = skiesArg
  ? skiesArg.slice('--skies='.length).split(',').map((value) => value.trim().toLowerCase()).filter(Boolean)
  : [];
const referenceMode = referenceModeArg ? referenceModeArg.slice('--reference-mode='.length) : 'manifest';

const segments = ['morning', 'day', 'evening', 'night'];
const skies = requestedSkies.length ? requestedSkies : ['clear', 'partly', 'cloudy', 'dark'];
const toolsDir = path.join(cwd, 'tools', 'background-generation');
const specsPath = path.join(toolsDir, 'prompt-specs.json');
const manifestPath = path.join(toolsDir, 'source-manifest.json');
const generatedDir = path.join(toolsDir, 'generated');
const outputPath = outputArg
  ? path.resolve(cwd, outputArg.slice('--out='.length))
  : path.join(generatedDir, `prompts-${seasons.join('-')}.json`);

const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const locationRefs = new Map(manifest.locations.map((location) => [location.id, location.reference]));
const locationSpecs = new Map(specs.locations.map((location) => [location.id, location]));
const prompts = [];

if (!['manifest', 'seasonal-clear'].includes(referenceMode)) {
  throw new Error('Unsupported --reference-mode. Use "manifest" or "seasonal-clear".');
}

const getStorageBaseUrl = (reference) => {
  if (!reference || !reference.url || !reference.source_key) {
    return '';
  }
  return reference.url.slice(0, reference.url.length - reference.source_key.length);
};

const buildPromptText = (location, season, segment, sky) => {
  const seasonText = specs.seasons[season] || `${season} seasonal atmosphere.`;
  const segmentText = specs.segments[segment] || `${segment} lighting.`;
  const skyText = specs.sky_variants[sky] || `${sky} sky profile.`;
  const climateText = location.climate_constraints
    ? `Climate constraints: ${location.climate_constraints}`
    : null;
  const constraints = specs.global_constraints.join(' ');
  const negatives = specs.negative_constraints.join(' ');
  const compositionStructure = (specs.composition_structure || []).join(' ');
  const seasonalEditConstraints = (specs.seasonal_edit_constraints || []).join(' ');
  const styleInstruction = (specs.style_instruction || 'Create a scene variant for <location>.')
    .replace('<location>', location.id);

  return [
    styleInstruction,
    compositionStructure ? `Standardized composition structure: ${compositionStructure}` : null,
    `Scene anchor: ${location.scene_anchor}`,
    `Consistency notes: ${location.consistency_notes}`,
    climateText,
    `Target season: ${season}. ${seasonText}`,
    seasonalEditConstraints ? `Seasonal edit rules: ${seasonalEditConstraints}` : null,
    `Target time segment: ${segment}. ${segmentText}`,
    `Target sky variant: ${sky}. ${skyText}`,
    constraints,
    `Negative constraints: ${negatives}`
  ].filter(Boolean).join(' ');
};

const locationsToBuild = requestedLocations.length
  ? specs.locations.filter((location) => requestedLocations.includes(location.id))
  : specs.locations;

const missingLocations = requestedLocations.filter((locationId) => !locationSpecs.has(locationId));
if (missingLocations.length) {
  throw new Error(`No prompt spec found for location(s): ${missingLocations.join(', ')}`);
}

for (let i = 0; i < locationsToBuild.length; i++) {
  const location = locationsToBuild[i];
  const manifestReference = locationRefs.get(location.id);

  if (!manifestReference) {
    throw new Error(`No source reference found for location "${location.id}" in source-manifest.json`);
  }

  if (!locationSpecs.has(location.id)) {
    throw new Error(`No prompt spec found for location "${location.id}"`);
  }

  for (let s = 0; s < seasons.length; s++) {
    for (let t = 0; t < segments.length; t++) {
      for (let k = 0; k < skies.length; k++) {
        const season = seasons[s];
        const segment = segments[t];
        const sky = skies[k];
        const fileName = `${location.id}_${season}_${segment}_${sky}.png`;
        const sourceFileName = referenceMode === 'seasonal-clear'
          ? `${location.id}_${season}_${segment}_clear.png`
          : path.basename(manifestReference.source_key);
        const sourceKey = `${manifest.prefix}/${sourceFileName}`;
        const sourceUrl = referenceMode === 'seasonal-clear'
          ? `${getStorageBaseUrl(manifestReference)}${sourceKey}`
          : manifestReference.url;

        prompts.push({
          file_name: fileName,
          location_id: location.id,
          season,
          segment,
          sky,
          source_image_url: sourceUrl,
          source_image_key: sourceKey,
          prompt: buildPromptText(location, season, segment, sky)
        });
      }
    }
  }
}

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      version: 1,
      generator: specs.generator || 'manual-image-generation',
      generation_mode: specs.generation_mode || 'manual_review',
      output: specs.output || null,
      generated_at: new Date().toISOString(),
      reference_mode: referenceMode,
      seasons,
      total: prompts.length,
      prompts
    },
    null,
    2
  )
);

console.log(`Wrote ${prompts.length} prompts to ${outputPath}`);

#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  ACTIVE_LOCATIONS,
  LOCATIONS,
  SEASONS,
  SEGMENTS,
  SKIES
} from '../backgrounds/shared.mjs';

const cwd = process.cwd();
const mode = process.argv[2];
const args = new Set(process.argv.slice(2));
const scopeArg = process.argv.find((arg) => arg.startsWith('--scope='));
const scope = scopeArg ? scopeArg.slice('--scope='.length) : 'all';
const includeWeatherMatrix = args.has('--include-weather-matrix');
const remotePrefix = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/';
const localPrefix = '/dev-assets/supabase-mirror/personal-website/';
const mirrorRoot = path.join(cwd, 'dev-assets', 'supabase-mirror', 'personal-website');
const targetFiles = [
  'index.html',
  'assets/js/backgrounds.js',
  'assets/css/main.css',
  'assets/css/pbd.css',
  'assets/css/art.css'
];

if (!['local', 'remote'].includes(mode) || !['all', 'backgrounds'].includes(scope)) {
  console.error('Usage: node scripts/supabase/switch-asset-source.mjs <local|remote> [--scope=all|backgrounds] [--include-weather-matrix]');
  process.exit(1);
}

const from = mode === 'local'
  ? remotePrefix + (scope === 'backgrounds' ? 'backgrounds/' : '')
  : localPrefix + (scope === 'backgrounds' ? 'backgrounds/' : '');
const to = mode === 'local'
  ? localPrefix + (scope === 'backgrounds' ? 'backgrounds/' : '')
  : remotePrefix + (scope === 'backgrounds' ? 'backgrounds/' : '');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectLocalTargets() {
  if (mode !== 'local') {
    return [];
  }

  const targets = new Set();
  const pattern = new RegExp(escapeRegex(from) + '([^"\'\\s)<>]+)', 'g');

  targetFiles.forEach((file) => {
    const filePath = path.join(cwd, file);
    if (!fs.existsSync(filePath)) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(pattern)) {
      const assetPath = (scope === 'backgrounds' ? 'backgrounds/' : '') + decodeURI(match[1]).split('#')[0];
      if (assetPath && !assetPath.endsWith('/')) {
        targets.add(assetPath);
      }
    }
  });

  if (scope === 'backgrounds') {
    LOCATIONS.forEach((location) => {
      SEGMENTS.forEach((segment) => targets.add(`backgrounds/${location}_${segment}.png`));
    });

    ACTIVE_LOCATIONS.forEach((location) => {
      ['spring', 'summer'].forEach((season) => {
        SEGMENTS.forEach((segment) => targets.add(`backgrounds/${location}_${season}_${segment}_clear.png`));
      });
    });

    if (includeWeatherMatrix) {
      ACTIVE_LOCATIONS.forEach((location) => {
        SEASONS.forEach((season) => {
          SEGMENTS.forEach((segment) => {
            SKIES.forEach((sky) => targets.add(`backgrounds/${location}_${season}_${segment}_${sky}.png`));
          });
        });
      });
    }
  }

  return Array.from(targets).sort();
}

const missing = collectLocalTargets().filter((assetPath) => !fs.existsSync(path.join(mirrorRoot, assetPath)));
if (missing.length > 0) {
  console.error(`Refusing local switch: ${missing.length} mirrored assets are missing.`);
  missing.slice(0, 25).forEach((assetPath) => console.error(`  ${assetPath}`));
  if (missing.length > 25) {
    console.error(`  ...and ${missing.length - 25} more`);
  }
  console.error('\nRun node scripts/supabase/mirror-public-assets.mjs --download to fetch missing assets, or use --scope=backgrounds if only background debugging is needed.');
  process.exit(1);
}

let changedFiles = 0;
let replacements = 0;

targetFiles.forEach((file) => {
  const filePath = path.join(cwd, file);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const before = fs.readFileSync(filePath, 'utf8');
  const after = before.split(from).join(to);
  if (after !== before) {
    const count = before.split(from).length - 1;
    fs.writeFileSync(filePath, after);
    changedFiles += 1;
    replacements += count;
    console.log(`${mode}: ${file} (${count} replacements)`);
  }
});

console.log(`Done. ${changedFiles} files changed, ${replacements} URL prefixes replaced.`);

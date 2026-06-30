#!/usr/bin/env node

import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import {
  ACTIVE_LOCATIONS,
  LOCATIONS,
  SEASONS,
  SEGMENTS,
  SKIES
} from '../backgrounds/shared.mjs';

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const scopeArg = process.argv.find((arg) => arg.startsWith('--scope='));
const scope = scopeArg ? scopeArg.slice('--scope='.length) : 'all';
const extraLocalRoots = process.argv
  .filter((arg) => arg.startsWith('--local-root='))
  .map((arg) => path.resolve(cwd, arg.slice('--local-root='.length)));
const remotePrefix = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/';
const localPrefix = '/dev-assets/supabase-mirror/personal-website/';
const mirrorRoot = path.join(cwd, 'dev-assets', 'supabase-mirror', 'personal-website');
const sourceFiles = [
  'index.html',
  'assets/js/backgrounds.js',
  'assets/css/main.css',
  'assets/css/pbd.css',
  'assets/css/art.css'
];
const localSearchRoots = [
  'tools/background-generation/backups/supabase-prune-2026-04-15',
  'tools/background-generation/backups/supabase-prune-2026-05-06-root',
  'tools/background-generation/backups/supabase-winter-retirement-2026-06-07',
  'tools/background-generation/backups/supabase-recompress-2026-04-15',
  'tools/background-generation/generated/.reference-cache',
  'tools/background-generation/generated/spring-images',
  'tools/background-generation/generated/fall-images',
  'tmp',
  'output'
].map((value) => path.join(cwd, value));
localSearchRoots.push(...extraLocalRoots);

const shouldDownload = args.has('--download');
const dryRun = args.has('--dry-run');
const force = args.has('--force');
const includeWeatherMatrix = args.has('--include-weather-matrix');

if (!['all', 'backgrounds'].includes(scope)) {
  console.error('Usage: node scripts/supabase/mirror-public-assets.mjs [--scope=all|backgrounds] [--include-weather-matrix] [--download] [--dry-run] [--force] [--local-root=/path]');
  process.exit(1);
}

function readIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function collectAssetPaths() {
  const assets = new Set();
  const remotePattern = new RegExp(remotePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^"\'\\s)<>]+)', 'g');
  const localPattern = new RegExp(localPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^"\'\\s)<>]+)', 'g');

  const addAsset = (value) => {
    const cleanValue = decodeURI(value).split('#')[0];
    if (cleanValue && !cleanValue.endsWith('/')) {
      assets.add(cleanValue);
    }
  };

  if (scope === 'all') {
    sourceFiles.forEach((sourceFile) => {
      const content = readIfExists(path.join(cwd, sourceFile));
      for (const match of content.matchAll(remotePattern)) {
        addAsset(match[1]);
      }
      for (const match of content.matchAll(localPattern)) {
        addAsset(match[1]);
      }
    });
  }

  LOCATIONS.forEach((location) => {
    SEGMENTS.forEach((segment) => {
      addAsset(`backgrounds/${location}_${segment}.png`);
    });
  });

  ACTIVE_LOCATIONS.forEach((location) => {
    ['spring', 'summer'].forEach((season) => {
      SEGMENTS.forEach((segment) => {
        addAsset(`backgrounds/${location}_${season}_${segment}_clear.png`);
      });
    });
  });

  if (includeWeatherMatrix) {
    ACTIVE_LOCATIONS.forEach((location) => {
      SEASONS.forEach((season) => {
        SEGMENTS.forEach((segment) => {
          SKIES.forEach((sky) => {
            addAsset(`backgrounds/${location}_${season}_${segment}_${sky}.png`);
          });
        });
      });
    });
  }

  return Array.from(assets).sort();
}

function walkFiles(root) {
  const results = [];
  if (!fs.existsSync(root)) {
    return results;
  }

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      fs.readdirSync(current).forEach((entry) => stack.push(path.join(current, entry)));
    } else if (stat.isFile()) {
      results.push(current);
    }
  }
  return results;
}

function buildLocalIndex() {
  const byTail = new Map();

  localSearchRoots.forEach((root) => {
    walkFiles(root).forEach((filePath) => {
      const relativeToRoot = path.relative(root, filePath);
      const basename = path.basename(filePath);
      const tails = new Set([
        basename,
        relativeToRoot,
        relativeToRoot.replace(/^files\//, ''),
        relativeToRoot.replace(/^backgrounds\//, ''),
        relativeToRoot.replace(/^originals\//, '')
      ]);

      tails.forEach((tail) => {
        if (!byTail.has(tail)) {
          byTail.set(tail, filePath);
        }
      });
    });
  });

  return byTail;
}

function findLocalSource(assetPath, localIndex) {
  const candidates = [
    assetPath,
    assetPath.replace(/^backgrounds\//, ''),
    path.basename(assetPath)
  ];

  for (const candidate of candidates) {
    const found = localIndex.get(candidate);
    if (found) {
      return found;
    }
  }

  return null;
}

function copyLocalSource(sourcePath, targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function download(remoteUrl, targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const request = https.get(remoteUrl, (response) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        response.resume();
        reject(new Error(`${response.statusCode} ${response.statusMessage}: ${remoteUrl}`));
        return;
      }

      const tmpPath = `${targetPath}.tmp`;
      const file = fs.createWriteStream(tmpPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          fs.renameSync(tmpPath, targetPath);
          resolve();
        });
      });
      file.on('error', reject);
    });

    request.on('error', reject);
  });
}

async function run() {
  const assetPaths = collectAssetPaths();
  const localIndex = buildLocalIndex();
  const summary = {
    total: assetPaths.length,
    existing: 0,
    copied: 0,
    downloadable: 0,
    downloaded: 0,
    missing: [],
    failed: []
  };

  for (const assetPath of assetPaths) {
    const targetPath = path.join(mirrorRoot, assetPath);
    if (!force && fs.existsSync(targetPath)) {
      summary.existing += 1;
      continue;
    }

    const localSource = findLocalSource(assetPath, localIndex);
    if (localSource) {
      if (!dryRun) {
        copyLocalSource(localSource, targetPath);
      }
      summary.copied += 1;
      continue;
    }

    if (shouldDownload) {
      try {
        await download(remotePrefix + encodeURI(assetPath), targetPath);
        summary.downloaded += 1;
      } catch (error) {
        summary.failed.push({
          asset: assetPath,
          error: error.message
        });
      }
    } else {
      summary.downloadable += 1;
      summary.missing.push(assetPath);
    }
  }

  console.log(JSON.stringify(summary, null, 2));
  if (summary.missing.length > 0) {
    console.log('\nRun with --download to fetch only missing files from Supabase. Existing mirror files are skipped unless --force is set.');
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

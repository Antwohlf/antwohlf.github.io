#!/usr/bin/env node

import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const scopeArg = process.argv.find((arg) => arg.startsWith('--scope='));
const scope = scopeArg ? scopeArg.slice('--scope='.length) : 'all';
const extraLocalRoots = process.argv
  .filter((arg) => arg.startsWith('--local-root='))
  .map((arg) => path.resolve(cwd, arg.slice('--local-root='.length)));
const remotePrefix = 'https://assets.anthonywohlfeil.com/';
const mirrorRoot = path.join(cwd, 'dev-assets', 'supabase-mirror', 'personal-website');
const localSearchRoots = [
  'tools/background-generation/backups/supabase-seasonal-2026-09-09/objects',
  'tools/background-generation/generated/static-backgrounds-20260909',
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

if (!['all', 'backgrounds'].includes(scope)) {
  console.error('Usage: node scripts/supabase/mirror-public-assets.mjs [--scope=all|backgrounds] [--download] [--dry-run] [--force] [--local-root=/path]');
  process.exit(1);
}

function collectAssetPaths() {
  const keys = JSON.parse(fs.readFileSync(path.join(cwd, 'scripts/r2/public-keys.json'), 'utf8'));
  const originalManifest = path.join(cwd, 'tools/background-generation/backups/supabase-seasonal-2026-09-09/manifest.json');
  if (fs.existsSync(originalManifest)) {
    keys.push(...JSON.parse(fs.readFileSync(originalManifest, 'utf8')).files.map((item) => item.object_key));
  }
  return Array.from(new Set(keys)).filter((key) => scope === 'all' || key.startsWith('backgrounds/')).sort();
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
    console.log('\nRun with --download to fetch only missing files from R2. Existing mirror files are skipped unless --force is set.');
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  PREFIX,
  getArgValue
} from './shared.mjs';
import { verifiedUpload } from '../r2/storage.mjs';

const args = process.argv.slice(2);
const dir = path.resolve(process.cwd(), getArgValue(args, '--dir', 'tools/background-generation/generated/spring-images'));
const seasonFilter = getArgValue(args, '--season', 'spring').trim().toLowerCase();
const overwrite = args.includes('--overwrite');
const artifactsDir = path.resolve(process.cwd(), getArgValue(args, '--artifacts-dir', 'tools/background-generation/review/qa/latest'));

const canonicalRegex = /^[a-z0-9]+_(spring|summer|fall|winter)_(morning|day|evening|night)_(clear|partly|cloudy|dark)\.png$/;

if (!fs.existsSync(dir)) {
  throw new Error(`Directory not found: ${dir}`);
}

const names = fs.readdirSync(dir).filter((name) => canonicalRegex.test(name));
const selected = names.filter((name) => !seasonFilter || name.includes(`_${seasonFilter}_`));
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const validatorPath = path.join(scriptDir, 'validate-visual-backgrounds.py');
const referenceDir = path.resolve(process.cwd(), getArgValue(args, '--reference-dir',
  'tools/background-generation/backups/supabase-seasonal-2026-09-09/objects/backgrounds'));
const validatorDirs = [
  dir,
  referenceDir,
  path.resolve(process.cwd(), 'tools/background-generation/generated/spring-images'),
  path.resolve(process.cwd(), 'tools/background-generation/generated/summer-images'),
  path.resolve(process.cwd(), 'tools/background-generation/generated/fall-images'),
  path.resolve(process.cwd(), 'tools/background-generation/generated/winter-images')
];

if (!selected.length) {
  throw new Error(`No canonical files found in ${dir} for season "${seasonFilter}"`);
}

const summary = {
  total: selected.length,
  uploaded: 0,
  failed: 0
};

const runVisualGate = () =>
  new Promise((resolve, reject) => {
    const qaArgs = [
      validatorPath,
      `--seasons=${seasonFilter}`,
      `--dirs=${validatorDirs.join(',')}`,
      `--artifacts-dir=${artifactsDir}`,
      '--fail-on-missing'
    ];

    console.log('Pre-upload hard gate: visual validator');
    console.log(`$ python3 ${qaArgs.join(' ')}`);

    const child = spawn('python3', qaArgs, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env
    });

    child.on('error', (error) => reject(error));
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Visual validator failed (exit ${code}). Upload blocked.`));
    });
  });

const uploadOne = async (filePath, objectKey) => {
  await verifiedUpload({ file: filePath, key: objectKey, visibility: 'private',
    contentType: 'image/png', overwrite });
};

const run = async () => {
  await runVisualGate();
  console.log('');
  console.log(`Upload directory: ${dir}`);
  console.log(`Season filter: ${seasonFilter || '(none)'}`);
  console.log(`Upsert existing: ${overwrite ? 'yes' : 'no'}`);
  console.log(`File count: ${selected.length}`);
  console.log('');

  for (let i = 0; i < selected.length; i++) {
    const name = selected[i];
    const filePath = path.join(dir, name);
    const objectKey = `${PREFIX}/${name}`;
    try {
      await uploadOne(filePath, objectKey);
      summary.uploaded += 1;
      console.log(`[uploaded] ${name}`);
    } catch (error) {
      summary.failed += 1;
      console.error(`[failed] ${name}: ${error.message}`);
    }
  }

  console.log('');
  console.log('Summary');
  console.log(`- total: ${summary.total}`);
  console.log(`- uploaded: ${summary.uploaded}`);
  console.log(`- failed: ${summary.failed}`);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

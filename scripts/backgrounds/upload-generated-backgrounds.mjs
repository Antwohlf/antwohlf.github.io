#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  BUCKET,
  PREFIX,
  loadDotEnv,
  requireEnv,
  encodeObjectKey,
  getArgValue
} from './shared.mjs';

loadDotEnv();

const args = process.argv.slice(2);
const dir = path.resolve(process.cwd(), getArgValue(args, '--dir', 'tools/background-generation/generated/spring-images'));
const seasonFilter = getArgValue(args, '--season', 'spring').trim().toLowerCase();
const overwrite = args.includes('--overwrite');
const artifactsDir = path.resolve(process.cwd(), getArgValue(args, '--artifacts-dir', 'tools/background-generation/review/qa/latest'));

const supabaseUrl = requireEnv('SUPABASE_URL');
const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
const uploadBase = `${supabaseUrl}/storage/v1/object/${BUCKET}`;
const listHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`
};
const canonicalRegex = /^[a-z0-9]+_(spring|summer|fall|winter)_(morning|day|evening|night)_(clear|partly|cloudy|dark)\.png$/;

if (!fs.existsSync(dir)) {
  throw new Error(`Directory not found: ${dir}`);
}

const names = fs.readdirSync(dir).filter((name) => canonicalRegex.test(name));
const selected = names.filter((name) => !seasonFilter || name.includes(`_${seasonFilter}_`));
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const validatorPath = path.join(scriptDir, 'validate-visual-backgrounds.py');
const uploadTimeoutMs = Number(getArgValue(args, '--upload-timeout-ms', '45000'));
const maxRetries = Number(getArgValue(args, '--max-retries', '4'));
const validatorDirs = [
  dir,
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
      '--use-supabase',
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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryUpload = (status, message) => {
  if (status >= 500) {
    return true;
  }
  return /bad gateway|gateway timeout|temporar|cloudflare|timeout|aborted/i.test(String(message || ''));
};

const uploadOne = async (filePath, objectKey) => {
  const bytes = fs.readFileSync(filePath);
  let attempt = 0;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), uploadTimeoutMs);
    let response;
    let status = 0;
    let text = '';

    try {
      response = await fetch(`${uploadBase}/${encodeObjectKey(objectKey)}`, {
        method: 'POST',
        headers: {
          ...listHeaders,
          'content-type': 'image/png',
          'x-upsert': overwrite ? 'true' : 'false'
        },
        body: bytes,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      status = response.status;
      if (response.ok) {
        return;
      }
      text = await response.text();
      if (attempt < maxRetries && shouldRetryUpload(status, text)) {
        await wait(800 * (attempt + 1));
        attempt += 1;
        continue;
      }
      throw new Error(`Upload failed (${status}): ${text}`);
    } catch (error) {
      clearTimeout(timeoutId);
      const message = error && error.message ? error.message : String(error);
      if (attempt < maxRetries && shouldRetryUpload(status, message)) {
        await wait(800 * (attempt + 1));
        attempt += 1;
        continue;
      }
      throw error;
    }
  }
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

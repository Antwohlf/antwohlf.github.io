#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  BUCKET,
  PREFIX,
  loadDotEnv,
  requireEnv,
  encodeObjectKey
} from './shared.mjs';

loadDotEnv();

const files = process.argv.slice(2).map((file) => path.resolve(process.cwd(), file));

if (!files.length) {
  throw new Error('Usage: node scripts/backgrounds/upload-selected-backgrounds.mjs <png> [png...]');
}

const canonicalRegex = /^[a-z0-9]+_(spring|summer|fall|winter)_(morning|day|evening|night)_(clear|partly|cloudy|dark)\.png$/;
const supabaseUrl = requireEnv('SUPABASE_URL');
const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
const uploadBase = `${supabaseUrl}/storage/v1/object/${BUCKET}`;
const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`
};

let uploaded = 0;

for (const filePath of files) {
  const name = path.basename(filePath);

  if (!canonicalRegex.test(name)) {
    throw new Error(`Not a canonical background filename: ${name}`);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  const objectKey = `${PREFIX}/${name}`;
  const response = await fetch(`${uploadBase}/${encodeObjectKey(objectKey)}`, {
    method: 'POST',
    headers: {
      ...headers,
      'content-type': 'image/png',
      'x-upsert': 'true'
    },
    body: fs.readFileSync(filePath)
  });

  if (!response.ok) {
    throw new Error(`Upload failed for ${name} (${response.status}): ${await response.text()}`);
  }

  uploaded += 1;
  console.log(`[uploaded] ${name}`);
}

console.log(`Uploaded ${uploaded} file(s).`);

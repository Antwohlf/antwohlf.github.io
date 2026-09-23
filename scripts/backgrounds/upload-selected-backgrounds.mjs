#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { PREFIX } from './shared.mjs';
import { verifiedUpload } from '../r2/storage.mjs';


const files = process.argv.slice(2).map((file) => path.resolve(process.cwd(), file));

if (!files.length) {
  throw new Error('Usage: node scripts/backgrounds/upload-selected-backgrounds.mjs <png> [png...]');
}

const canonicalRegex = /^[a-z0-9]+_(spring|summer|fall|winter)_(morning|day|evening|night)_(clear|partly|cloudy|dark)\.png$/;
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
  await verifiedUpload({ file: filePath, key: objectKey, visibility: 'private',
    contentType: 'image/png', overwrite: true });

  uploaded += 1;
  console.log(`[uploaded] ${name}`);
}

console.log(`Uploaded ${uploaded} file(s).`);

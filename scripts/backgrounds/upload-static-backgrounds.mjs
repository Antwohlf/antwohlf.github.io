#!/usr/bin/env node

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { verifiedUpload } from '../r2/storage.mjs';

if (!process.argv[2]) {
  throw new Error('Usage: node scripts/backgrounds/upload-static-backgrounds.mjs <manifest.json>');
}
const files = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// A versioned key is immutable. Verify the entire set before writing any file.
for (const item of files) {
  if (!/^backgrounds\/static-[a-z0-9-]+\/[a-z0-9_]+\.webp$/.test(item.object_key)) {
    throw new Error(`Invalid static object key: ${item.object_key}`);
  }
  const bytes = fs.readFileSync(item.file);
  if (bytes.length !== item.bytes || crypto.createHash('md5').update(bytes).digest('hex') !== item.md5) {
    throw new Error(`Local checksum mismatch: ${item.file}`);
  }
}

let count = 0;
for (const item of files) {
  await verifiedUpload({ file: item.file, key: item.object_key, visibility: 'public',
    contentType: 'image/webp', immutable: true });
  count += 1;
  if (count % 25 === 0 || count === files.length) {
    console.log(`Uploaded and verified ${count}/${files.length}`);
  }
}

const keysPath = path.resolve('scripts/r2/public-keys.json');
const publicKeys = new Set(JSON.parse(fs.readFileSync(keysPath, 'utf8')));
for (const item of files) publicKeys.add(item.object_key);
fs.writeFileSync(keysPath, JSON.stringify(Array.from(publicKeys).sort(), null, 2) + '\n');
console.log(`Updated ${keysPath}; commit this list with the site release.`);

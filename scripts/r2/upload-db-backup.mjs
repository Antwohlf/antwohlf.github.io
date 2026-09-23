#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { verifiedUpload } from './storage.mjs';

const arg = process.argv.find((item) => item.startsWith('--backup-dir='));
if (!arg) throw new Error('Usage: node scripts/r2/upload-db-backup.mjs --backup-dir=/path');
const backupDir = path.resolve(arg.slice('--backup-dir='.length));
const manifest = JSON.parse(await fs.readFile(path.join(backupDir, 'manifest.json'), 'utf8'));
const archive = await fs.readFile(path.join(backupDir, 'jobs.jsonl.gz'));
const sha256 = createHash('sha256').update(archive).digest('hex');
if (sha256 !== manifest.archive_sha256 || archive.length !== manifest.archive_bytes) {
  throw new Error('Database backup archive failed local verification');
}
const snapshot = manifest.created_at.replace(/[:.]/g, '-');
if (!/^\d{4}-\d\d-\d\dT[\d-]+\+00-00$/.test(snapshot)) {
  throw new Error(`Unexpected snapshot timestamp: ${manifest.created_at}`);
}
const files = [
  ['jobs.jsonl.gz', path.join(backupDir, 'jobs.jsonl.gz'), 'application/gzip'],
  ['manifest.json', path.join(backupDir, 'manifest.json'), 'application/json'],
  ['jobs-schema.sql', path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs-schema.sql'), 'application/sql'],
];
for (const [name, file, contentType] of files) {
  const result = await verifiedUpload({
    file, key: `jobs/${snapshot}/${name}`, visibility: 'private', contentType,
  });
  console.log(`Verified private R2 backup: ${result.key} (${result.bytes} bytes)`);
}

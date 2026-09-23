#!/usr/bin/env node

import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (!match) throw new Error(`Expected --name=value, received ${arg}`);
  return [match[1], match[2]];
}));

const requiredArgs = ['original-manifest', 'webp-manifest', 'other-manifest'];
for (const name of requiredArgs) {
  if (!args[name]) throw new Error(`Missing --${name}`);
}
const mode = args.mode || 'dry-run';
const scope = args.scope || 'all';
if (!['dry-run', 'upload', 'verify'].includes(mode) || !['all', 'public', 'private'].includes(scope)) {
  throw new Error('Use --mode=dry-run|upload|verify and --scope=all|public|private');
}

const originalPath = path.resolve(args['original-manifest']);
const webpPath = path.resolve(args['webp-manifest']);
const otherPath = path.resolve(args['other-manifest']);
const originals = JSON.parse(await fs.readFile(originalPath, 'utf8')).files;
const webps = JSON.parse(await fs.readFile(webpPath, 'utf8'));
const others = JSON.parse(await fs.readFile(otherPath, 'utf8')).files;

const safeKey = (key) => {
  if (!key || key.startsWith('/') || key.split('/').some((part) => part === '.' || part === '..' || !part)) {
    throw new Error(`Unsafe object key: ${key}`);
  }
  return key;
};
const digest = (bytes, algorithm) => createHash(algorithm).update(bytes).digest('hex');
const extensionMime = (key) => {
  const extension = path.extname(key).toLowerCase();
  return ({
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf', '.ico': 'image/x-icon',
  })[extension] || 'application/octet-stream';
};

const entries = [
  ...originals.map((item) => ({
    key: safeKey(item.object_key),
    file: path.resolve(path.dirname(originalPath), item.local_path),
    bytes: Number(item.bytes),
    sha256: item.sha256,
    mime: 'image/png',
    visibility: 'private',
  })),
  ...webps.map((item) => ({
    key: safeKey(item.object_key),
    file: path.resolve(item.file),
    bytes: Number(item.bytes),
    md5: item.md5,
    mime: 'image/webp',
    visibility: 'public',
  })),
  ...others.map((item) => ({
    key: safeKey(item.object_key),
    file: path.resolve(path.dirname(otherPath), item.local_path),
    bytes: Number(item.bytes),
    sha256: item.sha256,
    mime: item.mime_type || extensionMime(item.object_key),
    visibility: 'public',
  })),
].filter((item) => scope === 'all' || item.visibility === scope);

const identities = new Set();
for (const item of entries) {
  const identity = `${item.visibility}:${item.key}`;
  if (identities.has(identity)) throw new Error(`Duplicate object: ${identity}`);
  identities.add(identity);
}

if (scope === 'all' && (originals.length !== 264 || webps.length !== 264 || others.length !== 143)) {
  throw new Error(`Unexpected manifest counts: ${originals.length}, ${webps.length}, ${others.length}`);
}

// A full local read before any writes prevents a partial migration from a stale manifest.
let totalBytes = 0;
for (const item of entries) {
  const bytes = await fs.readFile(item.file);
  if (bytes.length !== item.bytes) throw new Error(`Size mismatch: ${item.file}`);
  if (item.sha256 && digest(bytes, 'sha256') !== item.sha256) throw new Error(`SHA-256 mismatch: ${item.file}`);
  if (item.md5 && digest(bytes, 'md5') !== item.md5) throw new Error(`MD5 mismatch: ${item.file}`);
  item.sha256 = digest(bytes, 'sha256');
  totalBytes += bytes.length;
}
console.log(`Local preflight passed: ${entries.length} objects, ${totalBytes} bytes (${scope})`);
if (mode === 'dry-run') process.exit(0);

const requiredEnv = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_BUCKET', 'R2_PRIVATE_BUCKET'];
for (const key of requiredEnv) if (!process.env[key]) throw new Error(`Missing ${key}`);
const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  maxAttempts: 4,
});
const bucketFor = (item) => item.visibility === 'private'
  ? process.env.R2_PRIVATE_BUCKET
  : process.env.R2_PUBLIC_BUCKET;

async function remoteSha256(bucket, key) {
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const hash = createHash('sha256');
  let size = 0;
  for await (const chunk of response.Body) {
    hash.update(chunk);
    size += chunk.length;
  }
  return { hash: hash.digest('hex'), size, mime: response.ContentType };
}

async function syncOne(item) {
  const bucket = bucketFor(item);
  if (mode === 'upload') {
    let exists = false;
    try {
      const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: item.key }));
      exists = Number(head.ContentLength) === item.bytes && head.Metadata?.sha256 === item.sha256;
    } catch (error) {
      if (error.$metadata?.httpStatusCode !== 404 && error.name !== 'NotFound') throw error;
    }
    if (!exists) {
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: item.key,
        Body: await fs.readFile(item.file),
        ContentLength: item.bytes,
        ContentType: item.mime,
        CacheControl: item.visibility === 'public' && item.key.startsWith('backgrounds/static-')
          ? 'public, max-age=31536000, immutable'
          : item.visibility === 'public' ? 'public, max-age=3600' : 'private, no-store',
        Metadata: { sha256: item.sha256 },
      }));
    }
  }
  const remote = await remoteSha256(bucket, item.key);
  if (remote.size !== item.bytes || remote.hash !== item.sha256 || remote.mime !== item.mime) {
    throw new Error(`R2 verification failed: ${bucket}/${item.key}`);
  }
}

let next = 0;
let done = 0;
const workers = Number(args.workers || 4);
if (!Number.isInteger(workers) || workers < 1 || workers > 12) throw new Error('Workers must be 1–12');
await Promise.all(Array.from({ length: Math.min(workers, entries.length) }, async () => {
  while (next < entries.length) {
    const item = entries[next++];
    await syncOne(item);
    done++;
    if (done % 25 === 0 || done === entries.length) console.log(`Verified ${done}/${entries.length}`);
  }
}));
console.log(`${mode === 'upload' ? 'Uploaded and verified' : 'Verified'} ${done} R2 objects`);

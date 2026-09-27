#!/usr/bin/env node
// Upload only new versioned keys. Credentials come from the environment.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { verifiedUpload } from '../r2/storage.mjs';

const manifestPath = process.argv[2];
if (!manifestPath) throw new Error('Usage: node scripts/backgrounds/publish-reviewed-release.mjs <release.json>');
const release = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
if (!/^[a-z0-9-]+$/.test(release.release) || release.assets.length !== 256) throw new Error('Invalid seasonal release');
const expected = new Set();
for (const c of ['detroit','annarbor','nyc','sansebastian'])
  for (const s of ['spring','summer','fall','winter'])
    for (const t of ['morning','day','evening','night'])
      for (const w of ['clear','partly','cloudy','dark']) expected.add(`${c}_${s}_${t}_${w}.png`);
const entries = release.assets.flatMap(asset => {
  if (!expected.delete(asset.filename) || asset.files.length !== 3) throw new Error('Invalid or duplicate asset');
  const stem = asset.filename.replace(/\.png$/, '');
  const destinations = new Set([
    `public:backgrounds/static-${release.release}/${stem}.webp`,
    `private:backgrounds/releases/${release.release}/delivery/${asset.filename}`,
    `private:backgrounds/releases/${release.release}/native/${asset.filename}`,
  ]);
  for (const f of asset.files) {
    if (!destinations.delete(`${f.visibility}:${f.key}`)) throw new Error(`Invalid destination: ${f.key}`);
    if (f.content_type !== (f.visibility === 'public' ? 'image/webp' : 'image/png')) throw new Error('Invalid MIME');
  }
  return asset.files;
});
if (expected.size) throw new Error('Incomplete seasonal matrix');
const archive = path.join(path.dirname(manifestPath), 'archive-manifest.json');
const archiveBytes = fs.readFileSync(archive);
entries.push({file:archive,key:`backgrounds/releases/${release.release}/manifest.json`,visibility:'private',content_type:'application/json',bytes:archiveBytes.length,sha256:hash(archiveBytes)});
// Validate the entire local selection before the first remote write.
for (const f of entries) {
  const bytes = fs.readFileSync(f.file);
  if (bytes.length !== f.bytes || hash(bytes) !== f.sha256) throw new Error(`Local checksum mismatch: ${f.file}`);
}
console.log(`Local preflight passed: ${entries.length} objects`);
const logPath = path.join(path.dirname(manifestPath), 'upload-verification.jsonl');
const verified = [];
let next = 0;
async function uploadWithRetry(item) {
  for (let attempt=0; ; attempt++) {
    try {
      return await verifiedUpload({file:item.file,key:item.key,visibility:item.visibility,
        contentType:item.content_type,immutable:item.visibility==='public'});
    } catch (error) {
      const code = error.code || error.cause?.code || '';
      const transient = ['ECONNRESET','ETIMEDOUT','EPIPE','UND_ERR_SOCKET','UND_ERR_CONNECT_TIMEOUT'].includes(code)
        || error.name === 'TimeoutError' || error.$metadata?.httpStatusCode >= 500;
      if (!transient || attempt >= 3) throw error;
      console.log(`Retrying interrupted transfer: ${item.key}`);
      await new Promise(resolve => setTimeout(resolve, Math.min(2000 * 2 ** attempt,10000)));
    }
  }
}
await Promise.all(Array.from({length:4}, async () => {
  while (next < entries.length) {
    const item = entries[next++];
    const result = await uploadWithRetry(item);
    if (result.sha256 !== item.sha256 || result.bytes !== item.bytes) throw new Error(`Source changed: ${item.key}`);
    const record = {...result,visibility:item.visibility,verified_at:new Date().toISOString()};
    verified.push(record);
    fs.appendFileSync(logPath,JSON.stringify(record)+'\n');
    if (verified.length % 25 === 0 || verified.length === entries.length) console.log(`Uploaded and GET-verified ${verified.length}/${entries.length}`);
  }
}));
fs.writeFileSync(path.join(path.dirname(manifestPath),'upload-verification.json'),JSON.stringify({release:release.release,verified_at:new Date().toISOString(),objects:verified},null,2)+'\n');
const keysPath = path.resolve('scripts/r2/public-keys.json');
const keys = new Set(JSON.parse(fs.readFileSync(keysPath,'utf8')));
for (const f of entries) if (f.visibility === 'public') keys.add(f.key);
fs.writeFileSync(keysPath,JSON.stringify([...keys].sort(),null,2)+'\n');
console.log('Release upload complete; public key inventory updated. Activate only after public-domain verification.');

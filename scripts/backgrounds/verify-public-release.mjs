#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const manifestPath = process.argv[2];
if (!manifestPath) throw new Error('Usage: node scripts/backgrounds/verify-public-release.mjs <release.json>');
const release = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const files = release.assets.map(a => a.files.find(f => f.visibility === 'public'));
assert.equal(files.length,256);
let next=0;
const results=[];
await Promise.all(Array.from({length:4},async()=>{
  while(next<files.length) {
    const f=files[next++];
    const url='https://assets.anthonywohlfeil.com/'+f.key;
    const r=await fetch(url,{headers:{Origin:'https://anthonywohlfeil.com'},signal:AbortSignal.timeout(60000)});
    assert.equal(r.status,200,url);
    const bytes=Buffer.from(await r.arrayBuffer());
    const sha256=createHash('sha256').update(bytes).digest('hex');
    assert.equal(sha256,f.sha256,url);
    assert.equal(bytes.length,f.bytes,url);
    assert.equal(r.headers.get('content-type'),'image/webp',url);
    assert.equal(r.headers.get('access-control-allow-origin'),'https://anthonywohlfeil.com',url);
    assert.match(r.headers.get('cache-control')||'',/immutable/,url);
    results.push({key:f.key,sha256,bytes:bytes.length,status:r.status,mime:r.headers.get('content-type'),cors:r.headers.get('access-control-allow-origin')});
    if(results.length%32===0) console.log(`Public-domain GET verified ${results.length}/256`);
  }
}));
const sample=await fetch('https://assets.anthonywohlfeil.com/'+files[0].key,{method:'HEAD',headers:{Origin:'https://www.anthonywohlfeil.com'}});
assert.equal(sample.status,200);
assert.equal(sample.headers.get('access-control-allow-origin'),'https://www.anthonywohlfeil.com');
fs.writeFileSync(path.join(path.dirname(manifestPath),'public-verification.json'),JSON.stringify({release:release.release,verified_at:new Date().toISOString(),www_cors_verified:true,objects:results},null,2)+'\n');
console.log('All 256 public files match the local release: SHA-256, length, MIME, cache headers and website CORS.');

import fs from 'node:fs';
import crypto from 'node:crypto';
import {loadDotEnv,requireEnv,encodeObjectKey} from './shared.mjs';
loadDotEnv();
const origin=requireEnv('SUPABASE_URL')+'/storage/v1';
const key=requireEnv('SUPABASE_SERVICE_ROLE_KEY');
const headers={apikey:key,Authorization:`Bearer ${key}`};
if (!process.argv[2]) throw new Error('Usage: node scripts/backgrounds/upload-static-backgrounds.mjs <manifest.json>');
const files=JSON.parse(fs.readFileSync(process.argv[2]));
// Validate the complete selection before uploading.
for (const f of files) {
 if (!/^backgrounds\/static-[a-z0-9-]+\/[a-z0-9_]+\.webp$/.test(f.object_key)) throw new Error('Invalid static object key');
 const bytes=fs.readFileSync(f.file);
 if (crypto.createHash('md5').update(bytes).digest('hex') !== f.md5) throw new Error('Local checksum mismatch: '+f.file);
}
async function request(url,options) {
 for(let attempt=0;attempt<6;attempt++) {
  const response=await fetch(url,options);
  if(response.status!==429 && response.status<500)return response;
  if(attempt===5)throw new Error('Storage request failed after retries: '+response.status);
  const delay=Math.max(10000,Number(response.headers.get('retry-after')||0)*1000,5000*(attempt+1));
  await response.arrayBuffer();
  console.log('Storage throttled; retrying in '+Math.round(delay/1000)+' seconds');
  await new Promise(resolve=>setTimeout(resolve,delay));
 }
}
let count=0;
for(let i=0;i<files.length;i+=2){await Promise.all(files.slice(i,i+2).map(async f=>{
 const publicUrl=origin+'/object/public/personal-website/'+encodeObjectKey(f.object_key);
 const matches = async () => {
   const head=await request(publicUrl,{method:'HEAD'});
   return head.ok && head.headers.get('etag')?.replaceAll('"','')===f.md5;
 };
 if (!(await matches())) {
   const r=await request(origin+'/object/personal-website/'+encodeObjectKey(f.object_key),{method:'POST',headers:{...headers,'Content-Type':'image/webp','x-upsert':'true','cache-control':'max-age=31536000'},body:fs.readFileSync(f.file)});
   if(!r.ok)throw new Error('Upload '+r.status+' '+f.object_key);
   let verified=false;
   for(let attempt=0;attempt<4;attempt++){
     if(await matches()){verified=true;break;}
     await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
   }
   if(!verified)throw new Error('Verification failed '+f.object_key);
 }
 count++;
 await new Promise(resolve=>setTimeout(resolve,500));
 }));if(i%40===0)console.log('Uploaded and verified '+count+'/'+files.length);}
console.log('All '+count+' static backgrounds verified');

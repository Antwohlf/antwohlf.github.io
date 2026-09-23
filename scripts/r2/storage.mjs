import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import {
  GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client,
} from '@aws-sdk/client-s3';
import { loadDotEnv, requireEnv } from '../backgrounds/shared.mjs';

loadDotEnv();

let client;
export function r2Client() {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
      },
      maxAttempts: 4,
    });
  }
  return client;
}

export function r2Bucket(visibility) {
  return requireEnv(visibility === 'private' ? 'R2_PRIVATE_BUCKET' : 'R2_PUBLIC_BUCKET');
}

export { ListObjectsV2Command };

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function verifiedUpload({ file, key, visibility, contentType, overwrite = false, immutable = false }) {
  if (!['private', 'public'].includes(visibility) || !key || key.startsWith('/') || key.split('/').includes('..')) {
    throw new Error(`Invalid R2 destination: ${visibility}/${key}`);
  }
  const bucket = r2Bucket(visibility);
  const bytes = await fs.readFile(file);
  const sha256 = hash(bytes);
  const s3 = r2Client();
  let existing;
  try {
    existing = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  } catch (error) {
    if (error.$metadata?.httpStatusCode !== 404 && error.name !== 'NotFound') throw error;
  }
  if (existing && existing.Metadata?.sha256 !== sha256 && !overwrite) {
    throw new Error(`R2 object already exists with different contents: ${bucket}/${key}`);
  }
  if (!existing || existing.Metadata?.sha256 !== sha256 || existing.ContentType !== contentType) {
    await s3.send(new PutObjectCommand({
      Bucket: bucket, Key: key, Body: bytes, ContentLength: bytes.length,
      ContentType: contentType,
      CacheControl: visibility === 'private' ? 'private, no-store'
        : immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
      Metadata: { sha256 },
    }));
  }
  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const remoteHash = createHash('sha256');
  let size = 0;
  for await (const chunk of response.Body) {
    remoteHash.update(chunk);
    size += chunk.length;
  }
  if (size !== bytes.length || remoteHash.digest('hex') !== sha256 || response.ContentType !== contentType) {
    throw new Error(`R2 hash, length, or MIME verification failed: ${bucket}/${key}`);
  }
  return { bucket, key, bytes: bytes.length, sha256 };
}

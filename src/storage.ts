/**
 * R2 Storage
 * 
 * Upload rendered assets to Cloudflare R2.
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getS3Client(): S3Client {
  if (!process.env.R2_ACCOUNT_ID) {
    throw new Error('R2_ACCOUNT_ID environment variable is required');
  }
  if (!process.env.R2_ACCESS_KEY_ID) {
    throw new Error('R2_ACCESS_KEY_ID environment variable is required');
  }
  if (!process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2_SECRET_ACCESS_KEY environment variable is required');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export interface UploadOptions {
  key: string;
  buffer: Buffer;
  mimeType: string;
}

export interface UploadResult {
  storageKey: string;
  etag?: string;
}

export async function uploadToR2(options: UploadOptions): Promise<UploadResult> {
  const { key, buffer, mimeType } = options;
  const s3 = getS3Client();

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME environment variable is required');
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    CacheControl: 'public, max-age=31536000, immutable', // Hash-based keys are immutable
  });

  const result = await s3.send(command);

  console.log(`[storage] Uploaded ${key} (${buffer.length} bytes)`);

  return {
    storageKey: key,
    etag: result.ETag?.replace(/"/g, ''),
  };
}

/**
 * Build a deterministic storage key for an asset.
 */
export function buildStorageKey(
  awardId: string,
  templateKey: string,
  templateVersion: number,
  contentHash: string,
  format: 'PNG' | 'PDF'
): string {
  const ext = format === 'PDF' ? 'pdf' : 'png';
  return `awards/${awardId}/${templateKey}/v${templateVersion}/${contentHash}.${ext}`;
}

/**
 * Generate a signed URL for downloading an asset.
 */
export async function getSignedDownloadUrl(
  storageKey: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const s3 = getS3Client();

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME environment variable is required');
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: storageKey,
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

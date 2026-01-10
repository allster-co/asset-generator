/**
 * Asset Generator - pg-boss Worker
 * 
 * Consumes render jobs from the queue and generates assets.
 */

import PgBoss from 'pg-boss';
import { render } from './renderer';
import { uploadToR2, buildStorageKey } from './storage';
import { upsertAwardAsset } from './db';

const JOB_TYPE = 'render_award_asset';

interface RenderJobPayload {
  awardId: string;
  clinicId: number;
  templateKey: string;
  templateVersion: number;
  variant: string;
  format: 'PNG' | 'PDF';
  awardMeta: {
    year: number;
    period: number;
    scope: 'TOWN' | 'COUNTY' | 'COUNTRY';
    scopeKey: string;
    categoryKey: string;
    title: string;
    tier: 'GOLD' | 'SILVER' | 'BRONZE';
  };
  payload: {
    rank: number;
    locationName: string;
    clinicName: string;
    datePeriod: string;
    websiteDomain: string;
    tier: 'GOLD' | 'SILVER' | 'BRONZE';
    categoryLabel?: string;
  };
}

async function processJob(job: PgBoss.Job<RenderJobPayload>): Promise<void> {
  const { data } = job;
  console.log(`[worker] Processing job ${job.id}: ${data.templateKey} for award ${data.awardId}`);

  try {
    // 1. Render the template
    const result = await render({
      templateKey: data.templateKey,
      templateVersion: data.templateVersion,
      variant: data.variant,
      format: data.format,
      payload: data.payload,
    });

    // 2. Build storage key
    const storageKey = buildStorageKey(
      data.awardId,
      data.templateKey,
      data.templateVersion,
      result.contentHash,
      data.format
    );

    // 3. Upload to R2
    const uploadResult = await uploadToR2({
      key: storageKey,
      buffer: result.buffer,
      mimeType: result.mimeType,
    });

    // 4. UPSERT AwardAsset record
    const assetId = await upsertAwardAsset({
      awardId: data.awardId,
      clinicId: data.clinicId,
      templateKey: data.templateKey,
      templateVersion: data.templateVersion,
      format: data.format,
      variant: data.variant,
      width: result.width,
      height: result.height,
      contentHash: result.contentHash,
      storageKey: uploadResult.storageKey,
      mimeType: result.mimeType,
      byteSize: result.buffer.length,
      etag: uploadResult.etag,
    });

    console.log(`[worker] Completed job ${job.id}: asset ${assetId} stored at ${storageKey}`);
  } catch (error) {
    console.error(`[worker] Failed job ${job.id}:`, error);
    throw error; // Re-throw to trigger retry
  }
}

async function start(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const boss = new PgBoss({
    connectionString: process.env.DATABASE_URL,
    schema: 'pgboss',
  });

  boss.on('error', (error) => {
    console.error('[pg-boss] Error:', error);
  });

  await boss.start();
  console.log('[worker] pg-boss started');

  // Register job handler
  await boss.work<RenderJobPayload>(
    JOB_TYPE,
    { teamConcurrency: 2 }, // Process 2 jobs concurrently
    async (job) => {
      await processJob(job);
    }
  );

  console.log(`[worker] Listening for ${JOB_TYPE} jobs...`);

  // Graceful shutdown
  const shutdown = async () => {
    console.log('[worker] Shutting down...');
    await boss.stop();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((error) => {
  console.error('[worker] Failed to start:', error);
  process.exit(1);
});

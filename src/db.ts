/**
 * Database Operations
 * 
 * Direct Postgres connection for AwardAsset UPSERT.
 * Uses raw SQL to avoid Prisma schema conflicts.
 */

import { Pool } from 'pg';
import { randomUUID } from 'crypto';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

export interface UpsertAssetParams {
  awardId: string;
  clinicId: number;
  templateKey: string;
  templateVersion: number;
  format: 'PNG' | 'PDF';
  variant: string;
  width?: number;
  height?: number;
  contentHash: string;
  storageKey: string;
  mimeType: string;
  byteSize: number;
  etag?: string;
}

/**
 * UPSERT an AwardAsset record.
 * 
 * Uses ON CONFLICT to update existing records when regenerating assets.
 */
export async function upsertAwardAsset(params: UpsertAssetParams): Promise<string> {
  const {
    awardId, clinicId, templateKey, templateVersion, format,
    variant, width, height, contentHash, storageKey, mimeType, byteSize, etag
  } = params;

  const id = randomUUID();
  const pool = getPool();

  const result = await pool.query(`
    INSERT INTO "AwardAsset" (
      id, "awardId", "clinicId", "templateKey", "templateVersion",
      format, variant, width, height, "contentHash", "storageKey",
      "mimeType", "byteSize", etag, "createdAt", "updatedAt"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now(), now())
    ON CONFLICT ("awardId", "templateKey", "templateVersion", variant, format)
    DO UPDATE SET
      "contentHash" = EXCLUDED."contentHash",
      "storageKey" = EXCLUDED."storageKey",
      "mimeType" = EXCLUDED."mimeType",
      "byteSize" = EXCLUDED."byteSize",
      etag = EXCLUDED.etag,
      "updatedAt" = now()
    RETURNING id
  `, [
    id, awardId, clinicId, templateKey, templateVersion,
    format, variant, width ?? null, height ?? null, contentHash, storageKey,
    mimeType, byteSize, etag ?? null
  ]);

  return result.rows[0].id;
}

/**
 * Close the database pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[db] Pool closed');
  }
}

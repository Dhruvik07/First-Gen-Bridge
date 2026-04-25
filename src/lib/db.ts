import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import { env } from '@/config/env';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return pool;
}

/** Run a parameterized query and return the rows. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

/** Acquire a client from the pool for transactions or multi-step operations. */
export async function getClient(): Promise<PoolClient> {
  return getPool().connect();
}

/** Gracefully shut down the connection pool. */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

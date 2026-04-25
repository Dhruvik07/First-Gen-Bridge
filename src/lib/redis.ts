import Redis from 'ioredis';
import { env } from '@/config/env';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redis;
}

/** Store a session with a TTL (seconds). */
export async function setSession(
  token: string,
  data: Record<string, unknown>,
  ttl: number,
): Promise<void> {
  await getRedis().set(
    `session:${token}`,
    JSON.stringify(data),
    'EX',
    ttl,
  );
}

/** Retrieve a session by token. Returns null if expired or missing. */
export async function getSession(
  token: string,
): Promise<Record<string, unknown> | null> {
  const raw = await getRedis().get(`session:${token}`);
  if (!raw) return null;
  return JSON.parse(raw) as Record<string, unknown>;
}

/** Delete a session by token. */
export async function deleteSession(token: string): Promise<void> {
  await getRedis().del(`session:${token}`);
}

/** Gracefully disconnect the Redis client. */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

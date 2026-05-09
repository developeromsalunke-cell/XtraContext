/**
 * XtraContext — Redis Client Singleton
 * Uses ioredis with lazy connection. Falls back gracefully if Redis is unavailable.
 */

import Redis from "ioredis";

const globalForRedis = globalThis as typeof globalThis & {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn(
      "[XtraContext] REDIS_URL not set. Rate limiting will be disabled."
    );
    // Return a client that will fail to connect — callers handle gracefully
    return new Redis({ lazyConnect: true, maxRetriesPerRequest: 0 });
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number): number | null {
      if (times > 5) {
        console.error("[XtraContext] Redis connection failed after 5 retries.");
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  client.on("error", (err: Error) => {
    console.error("[XtraContext] Redis error:", err.message);
  });

  client.on("connect", () => {
    console.info("[XtraContext] Redis connected.");
  });

  return client;
}

export const redis: Redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

/**
 * Check if Redis is available and connected.
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    if (redis.status !== "ready") {
      await redis.connect();
    }
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * XtraContext — Sliding Window Rate Limiter (Redis-backed)
 * Uses a sorted set per key with timestamps as scores.
 * Falls back to allow-all if Redis is unavailable.
 */

import { redis, isRedisAvailable } from "@/lib/redis";
import type { RateLimitResult } from "@/lib/types";

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  readonly maxRequests: number;
  /** Window duration in milliseconds */
  readonly windowMs: number;
}

/**
 * Default rate limit configuration, loaded from environment variables.
 */
export const defaultRateLimitConfig: RateLimitConfig = {
  maxRequests: parseInt(process.env.API_RATE_LIMIT_MAX ?? "60", 10),
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS ?? "60000", 10),
};

/**
 * Check rate limit for a given key using a Redis sorted-set sliding window.
 *
 * @param key - Unique identifier (e.g., API key prefix + endpoint)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success flag, remaining count, and reset timestamp
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = defaultRateLimitConfig
): Promise<RateLimitResult> {
  const available = await isRedisAvailable();
  if (!available) {
    // If Redis is down, allow requests through (fail-open for availability)
    return { success: true, remaining: config.maxRequests, resetAt: 0 };
  }

  const now = Date.now();
  const windowStart = now - config.windowMs;
  const redisKey = `ratelimit:${key}`;

  // Lua script for atomic sliding window check
  // 1. Remove expired entries
  // 2. Count current entries
  // 3. Add new entry if under limit
  const luaScript = `
    local key = KEYS[1]
    local windowStart = tonumber(ARGV[1])
    local now = tonumber(ARGV[2])
    local maxRequests = tonumber(ARGV[3])
    local windowMs = tonumber(ARGV[4])

    -- Remove entries outside the window
    redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)

    -- Count current requests in window
    local currentCount = redis.call('ZCARD', key)

    if currentCount < maxRequests then
      -- Add this request
      redis.call('ZADD', key, now, now .. '-' .. math.random(1000000))
      redis.call('PEXPIRE', key, windowMs)
      return {1, maxRequests - currentCount - 1}
    else
      return {0, 0}
    end
  `;

  const result = (await redis.eval(
    luaScript,
    1,
    redisKey,
    String(windowStart),
    String(now),
    String(config.maxRequests),
    String(config.windowMs)
  )) as [number, number];

  const success = result[0] === 1;
  const remaining = result[1];
  const resetAt = now + config.windowMs;

  return { success, remaining, resetAt };
}

/**
 * Set standard rate limit headers on a Response.
 */
export function setRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult,
  config: RateLimitConfig = defaultRateLimitConfig
): void {
  headers.set("X-RateLimit-Limit", String(config.maxRequests));
  headers.set("X-RateLimit-Remaining", String(result.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
}

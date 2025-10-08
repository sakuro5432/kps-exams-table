import "server-only";
import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URI);

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

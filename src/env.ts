import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MYKU_PUBLIC_KEY: z.string().min(1, "MYKU_PUBLIC_KEY is required!").trim(),
    DATABASE_URL: z
      .string()
      .regex(
        /^mysql:\/\/[^:]+:[^@]+@[^:/]+:\d{2,5}\/[a-zA-Z0-9_]+$/,
        "DATABASE_URL must be in the format mysql://user:pass@host:port/db"
      )
      .trim(),
    NEXTAUTH_SECRET: z
      .string()
      .min(8, "NEXTAUTH_SECRET must be at least 8 characters long")
      .trim(),
    NEXTAUTH_URL: z.url("NEXTAUTH_URL must be a valid URL").trim(),
    REDIS_URI: z
      .string()
      .url("REDIS_URI must be a valid URL")
      .trim()
      .refine(
        (v) => v.startsWith("redis://") || v.startsWith("rediss://"),
        "REDIS_URI must start with redis:// or rediss://"
      ),
    MONGODB_URI: z
      .string()
      .regex(
        /^mongodb:\/\/[^:\/\s]+:[^@\/\s]+@[^:\/\s]+:\d{2,5}(\/[a-zA-Z0-9_-]*)?(\?.+)?$/,
        "MONGODB_URI must be in the format mongodb://user:pass@host:port/db?directConnection=true"
      ),
  },
  shared: {
    NODE_ENV: z.enum(
      ["development", "test", "production"],
      "NODE_ENV is required and must be one of 'development', 'test', or 'production'"
    ),
  },
  client: {
    NEXT_PUBLIC_BASEURL: z
      .url("NEXT_PUBLIC_BASEURL must be a valid URL")
      .trim(),
    NEXT_PUBLIC_MYKU_API_URL: z
      .url("NEXT_PUBLIC_MYKU_API_URL must be a valid URL")
      .trim(),
    NEXT_PUBLIC_MYKU_APP_KEY: z.string().trim(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URI: process.env.REDIS_URI,
    MYKU_PUBLIC_KEY: process.env.MYKU_PUBLIC_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
    NEXT_PUBLIC_MYKU_API_URL: process.env.NEXT_PUBLIC_MYKU_API_URL,
    NEXT_PUBLIC_MYKU_APP_KEY: process.env.NEXT_PUBLIC_MYKU_APP_KEY,
  },
});

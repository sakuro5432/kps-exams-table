import { z } from "zod";
import pkg from "@next/env";

const projectDir = process.cwd();
pkg.loadEnvConfig(projectDir);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"], {
    message:
      "NODE_ENV is required and must be one of 'development', 'test', or 'production'",
  }),
  MYKU_PUBLIC_KEY: z.string().min(1, "MYKU_PUBLIC_KEY is required").trim(),
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
  NEXT_PUBLIC_BASEURL: z.url("NEXT_PUBLIC_BASEURL must be a valid URL").trim(),
  REDIS_URI: z.url("REDIS_URI must be a valid URL").trim(),
});

export const envServer = {
  NODE_ENV: process.env.NODE_ENV,
  MYKU_PUBLIC_KEY: process.env.MYKU_PUBLIC_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  REDIS_URI: process.env.REDIS_URI,
};

async function testEnv() {
  try {
    const env = envSchema.safeParse(envServer);
    if (!env.success) throw new Error(env.error.issues[0].message);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

testEnv();

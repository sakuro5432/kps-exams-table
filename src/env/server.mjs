import { z } from "zod";
import pkg from '@next/env'
 
const projectDir = process.cwd()
pkg.loadEnvConfig(projectDir)

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"], {
    message:
      "NODE_ENV is required and must be one of 'development', 'test', or 'production'",
  }),
  MYKU_PUBLIC_KEY: z.string().min(1, "MYKU_PUBLIC_KEY is required"),
  DATABASE_URL: z
    .string()
    .regex(
      /^mysql:\/\/[^:]+:[^@]+@[^:/]+:\d{2,5}\/[a-zA-Z0-9_]+$/,
      "DATABASE_URL must be in the format mysql://user:pass@host:port/db"
    ),
  NEXTAUTH_SECRET: z
    .string()
    .min(8, "NEXTAUTH_SECRET must be at least 8 characters long"),
  NEXTAUTH_URL: z.url("NEXTAUTH_URL must be a valid URL"),
  NEXT_PUBLIC_URL: z.url("NEXT_PUBLIC_URL must be a valid URL"),
});

export const envServer = {
  NODE_ENV: process.env.NODE_ENV,
  MYKU_PUBLIC_KEY: process.env.MYKU_PUBLIC_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_BASEURL,
};

export async function testEnv() {
  try {
    const env = envSchema.safeParse(envServer);
    if (!env.success) throw new Error(env.error.issues[0].message);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

testEnv();

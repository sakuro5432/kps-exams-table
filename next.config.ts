import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./src/env.ts");

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => [
    {
      source: "/",
      destination: "/login",
      permanent: true,
    },
  ],
};

export default nextConfig;

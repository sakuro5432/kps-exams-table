declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MYKU_PUBLIC_KEY: string;
      DATABASE_URL: string;
      MONGODB_URI: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      NEXT_PUBLIC_BASEURL?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

"use client";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Logout } from "@/components/LogoutDialog";
import { Provider as JotaiProvider } from "jotai";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

interface Props {
  children: React.ReactNode;
}
export function Providers({ children }: Props) {
  return (
    <JotaiProvider>
      <NuqsAdapter>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-center" richColors />
            {children}
            <Logout />
          </QueryClientProvider>
        </SessionProvider>
      </NuqsAdapter>
    </JotaiProvider>
  );
}

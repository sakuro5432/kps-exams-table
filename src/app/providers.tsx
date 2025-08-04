"use client";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

interface Props {
  children: React.ReactNode;
}
export function Providers({ children }: Props) {
  return (
    <NuqsAdapter>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" richColors />

          {children}
        </QueryClientProvider>
      </SessionProvider>
    </NuqsAdapter>
  );
}

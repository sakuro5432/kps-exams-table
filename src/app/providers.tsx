"use client";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export function Providers({ children }: Props) {
  return (
    <div>
      <Toaster position="top-center" richColors />
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}

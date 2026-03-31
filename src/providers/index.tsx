"use client";

import { ReactNode } from "react";
import { LenisProvider } from "./LenisProvider";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { FaviconUpdater } from "@/components/layout/FaviconUpdater";
import { LanguageManager } from "@/components/layout/LanguageManager";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <LenisProvider>
          <FaviconUpdater />
          <LanguageManager />
          {children}
          <Toaster richColors closeButton position="top-center" />
        </LenisProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

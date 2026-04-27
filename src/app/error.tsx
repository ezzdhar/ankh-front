"use client";

import { useEffect } from "react";
import { useTranslation } from "@/i18n/hooks";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation("common");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF8EF] px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-9xl font-bold text-[#3A0F0E] font-cormorant tracking-tighter opacity-10 select-none">
          Oops
        </h1>
        
        <div className="-mt-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-medium text-[#3A0F0E] font-cormorant uppercase tracking-widest">
            {t("error")}
          </h2>
          <p className="text-[#3A0F0E]/60 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            Something went wrong while processing your request. Please try again or go back home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="h-12 px-8 border-2 border-[#3A0F0E] text-[#3A0F0E] rounded-full hover:bg-[#3A0F0E] hover:text-white transition-all font-medium uppercase tracking-widest text-xs"
          >
            <RefreshCcw size={16} className="mr-2" />
            {t("retry")}
          </Button>
          
          <Button
            asChild
            className="h-12 px-8 bg-[#310E0E]! hover:bg-[#4a1818]! text-white! rounded-full transition-all font-medium uppercase tracking-widest text-xs"
          >
            <Link href="/">
              <Home size={16} className="mr-2" />
              {t("nav.home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

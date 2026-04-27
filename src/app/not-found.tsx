"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/hooks";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF8EF] px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-9xl font-bold text-[#3A0F0E] font-cormorant tracking-tighter opacity-10 select-none">
          404
        </h1>
        
        <div className="-mt-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-medium text-[#3A0F0E] font-cormorant uppercase tracking-widest">
            {t("not_found.title")}
          </h2>
          <p className="text-[#3A0F0E]/60 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            {t("not_found.description")}
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            asChild
            className="h-12 px-8 bg-[#310E0E]! hover:bg-[#4a1818]! text-white! rounded-full shadow-lg hover:shadow-xl transition-all font-medium uppercase tracking-widest text-xs"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home size={16} />
              {t("not_found.button")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

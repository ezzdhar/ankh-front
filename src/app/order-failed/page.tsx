"use client";

import { useTranslation } from "@/i18n/hooks";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderFailedPage() {
  const { t } = useTranslation(["checkout", "cart"]);

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 flex items-center justify-center min-h-[60vh]">
        {/* Failed Banner */}
        <div className="bg-[#FCF7F1]/50 border border-[#A32020]/10 rounded-sm p-8 md:p-12 text-center space-y-6 w-full max-w-2xl">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-[#A32020] flex items-center justify-center mx-auto bg-[#A32020]/5">
            <XCircle
              size={40}
              className="md:size-60 text-[#A32020]"
              strokeWidth={1}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-medium text-[#A32020]">
              {t("checkout:failed.title")}
            </h1>
            <p className="text-sm md:text-base text-[#3A0F0E]/60 max-w-md mx-auto">
              {t("checkout:failed.message")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
            <Button
              asChild
              variant="outline"
              className="flex-1 max-w-xs h-12 border-[#3A0F0E] text-[#3A0F0E] rounded-full uppercase text-xs tracking-widest hover:bg-[#3A0F0E] hover:text-white! transition-all font-medium"
            >
              <Link href="/">{t("checkout:failed.backToHome")}</Link>
            </Button>
            <Button
              asChild
              className="flex-1 max-w-xs h-12 bg-[#A32020]! hover:bg-[#A32020]/90! text-white! rounded-full uppercase text-xs tracking-widest transition-all font-bold"
            >
              <Link href="/checkout">{t("checkout:failed.tryAgain")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

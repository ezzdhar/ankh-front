"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function TermsPage() {
  const { t } = useTranslation("common");
  const { data: settingsData, isLoading } = useSiteSettings();
  const html = settingsData?.data?.terms_and_conditions;

  return (
    <div className="w-full bg-[#FFF8EF] min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4! mx-auto">
        <nav className="flex justify-center items-center gap-2 text-sm text-maroon/70">
          <Link href="/" className="hover:text-maroon transition-colors">
            {t("nav.home")}
          </Link>
          <ChevronRight size={14} />
          <span className="text-maroon">{t("footer.terms")}</span>
        </nav>
      </div>

      {/* Content */}
      <div className="container py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0F0E]"></div>
            </div>
          ) : html ? (
            <div
              className="policy-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="text-center text-maroon/60 py-20">{t("loading")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

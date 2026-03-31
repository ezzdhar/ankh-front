"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useBanners } from "@/hooks/useBanners";

export default function AboutPage() {
  const { t } = useTranslation("about");
  const { data: settingsData, isLoading } = useSiteSettings();
  const { data: bannersData } = useBanners();
  const aboutHtml = settingsData?.data?.about_us;
  const banner = bannersData?.data?.[3];

  return (
    <div className="w-full bg-[#FFF8EF] flex flex-col justify-center items-center">
      {/* Breadcrumb */}
      <div className="container py-4! mx-auto">
        <nav className="flex justify-center items-center gap-2 text-sm text-maroon/70">
          <Link href="/" className="hover:text-maroon transition-colors">
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight size={14} />
          <span className="text-maroon">{t("breadcrumb.about")}</span>
        </nav>
      </div>

      {/* Hero Image */}
      <div className="w-full">
        <div className="relative w-full aspect-16/7">
          <Image
            src={banner?.image || "/about.webp"}
            alt={banner?.name || "ANKH About"}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="container pt-6 md:pt-10 pb-12 mx-auto">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0F0E]"></div>
            </div>
          ) : aboutHtml ? (
            <div
              className="policy-content"
              dangerouslySetInnerHTML={{ __html: aboutHtml }}
            />
          ) : (
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-medium tracking-wide text-maroon mb-8">
                {t("mainTitle")}
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-maroon/80 mb-16">
                {t("intro")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslation } from "@/i18n/hooks";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMounted } from "@/hooks/useIsMounted";

interface HeroProps {
  image?: string;
  title?: string;
  description?: string;
  link?: string;
  isLoading?: boolean;
}

export function Hero({
  image,
  title,
  description,
  link,
  isLoading: isParentLoading = false,
}: HeroProps) {
  const { t } = useTranslation("home");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(image || "/landing.webp");

  const isMounted = useIsMounted();
  const displayTitle = title || t("hero.title", { lng: isMounted ? undefined : "en" });
  const displayLink = link || "/search";

  const showLoader = isParentLoading || isImageLoading;

  return (
    <section className="relative w-full overflow-hidden bg-[#3A0F0E] aspect-9/16 md:aspect-auto md:h-[calc(100vh-60px)]">
      <div className="absolute inset-0">
        {showLoader && (
          <Skeleton className="absolute inset-0 w-full h-full bg-[#3A0F0E]/50 z-10" />
        )}
        <Image
          src={imgSrc}
          alt={displayTitle}
          fill
          sizes="100vw"
          quality={80}
          className={`object-cover object-center transition-opacity duration-700 ${
            showLoader ? "opacity-0" : "opacity-100"
          }`}
          priority
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setImgSrc("/landing.webp"); // Fallback
            setIsImageLoading(false); // Stop loading animation
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6 text-center p-6 pb-20 text-white z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-wide uppercase drop-shadow-md">
          {displayTitle}
        </h1>
        {description && (
          <p className="text-sm sm:text-base md:text-lg max-w-2xl drop-shadow-md hidden md:block">
            {description}
          </p>
        )}

        <Button
          asChild
          variant="outline"
          className="relative overflow-hidden py-3! px-8! h-12! rounded-full border border-white bg-transparent text-white text-base tracking-widest uppercase transition-all duration-300 group hover:text-[#3A0F0E] hover:border-white"
        >
          <Link href={displayLink} className="relative z-10">
            <span className="relative z-10 text-white group-hover:text-[#3A0F0E] transition-colors duration-300">
              {t("hero.cta", { lng: isMounted ? undefined : "en" })}
            </span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0 ease-out" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

"use client";

import { useTranslation } from "@/i18n/hooks";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WinterCollectionProps {
  image?: string;
  title?: string;
  link?: string;
}

export function WinterCollection({
  image,
  title,
  link,
}: WinterCollectionProps) {
  const { t } = useTranslation("home");

  const displayImage = image || "/winter-collection.webp";
  const displayTitle = title || t("hero.title");
  const displayLink = link || "/search";

  return (
    <section className="relative w-full overflow-hidden bg-[#310E0E] aspect-9/16 md:aspect-auto md:h-[calc(100vh-60px)]">
      <div className="absolute inset-0">
        <Image
          src={displayImage}
          alt={displayTitle}
          fill
          sizes="100vw"
          quality={75}
          loading="lazy"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6 text-center p-6 pb-20 text-white z-10">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-wide uppercase drop-shadow-md">
          {displayTitle}
        </h1>

        <Button
          asChild
          variant="outline"
          className="relative overflow-hidden py-3! px-8! h-12! rounded-full border border-white bg-transparent text-white text-base tracking-widest uppercase transition-all duration-300 group hover:text-[#3A0F0E] hover:border-white"
        >
          <Link href={displayLink} className="relative z-10">
            <span className="relative z-10 text-white group-hover:text-[#3A0F0E] transition-colors duration-300">
              {t("hero.cta")}
            </span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0 ease-out" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

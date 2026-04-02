"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = "https://admin.ankh-eg.com/storage/";

interface InspiredItem {
  id: number;
  image: string;
  link: string;
}

interface InstagramSectionProps {
  items?: InspiredItem[];
  isLoading?: boolean;
}

export function InstagramSection({
  items = [],
  isLoading,
}: InstagramSectionProps) {
  if (isLoading) {
    return (
      <section className="container bg-[#FFF8EF]">
        <div className="flex flex-col items-center gap-6 mb-10">
          <Skeleton className="h-8 w-64 md:w-96" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="w-full px-4 md:px-8">
          <div className="flex gap-2 md:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1">
                <Skeleton className="aspect-3/4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="container bg-[#FFF8EF] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center gap-6 mb-10">
        <h2 className="text-center text-lg md:text-2xl font-normal tracking-[0.2em] uppercase text-maroon">
          Follow Us On Instagram
        </h2>
        <Link
          href="https://instagram.com/ankh.eg_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm md:text-base text-maroon/70 hover:text-maroon transition-colors tracking-wide"
        >
          @ankh.eg_
        </Link>
      </div>

      <div className="w-full px-4 md:px-8">
        <div className="flex gap-2 md:gap-4">
          {items.slice(0, 3).map((image) => (
            <Link
              key={image.id}
              href={image.link || "https://instagram.com/ankh.eg_"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 group"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                <Image
                  src={
                    image.image.startsWith("http")
                      ? image.image
                      : `${API_BASE_URL}${image.image}`
                  }
                  alt="Ankh Inspired"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

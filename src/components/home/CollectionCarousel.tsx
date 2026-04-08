"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface CarouselItem {
  id: string | number;
  image: string;
  title: string;
  link?: string;
  price?: string | number;
  price_after_discount?: string | number;
}

interface CollectionCarouselProps {
  title?: string;
  items: CarouselItem[];
  autoplayDelay?: number;
  isProduct?: boolean;
  isLoading?: boolean;
}

export function CollectionCarousel({
  title,
  items,
  autoplayDelay = 3000,
  isProduct = false,
  isLoading = false,
}: CollectionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })],
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full bg-[#FFF8EF]" dir="ltr">
      <div className="w-full flex flex-col justify-center items-center gap-8 mx-auto px-6 md:px-10">
        {title && (
          <h2 className="text-center text-lg md:text-2xl font-normal tracking-[0.2em] uppercase text-maroon">
            {title}
          </h2>
        )}

        <div className="container relative mt-5">
          {isLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-[0_0_50%] md:flex-[0_0_25%]">
                  <div className="space-y-4">
                    <Skeleton className="aspect-3/4 w-full bg-gray-100 rounded-sm" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    {isProduct && <Skeleton className="h-4 w-1/2 mx-auto" />}
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4!">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex-[0_0_50%] md:flex-[0_0_25%] min-w-0 pl-4!"
                  >
                    <Link href={item.link || "#"} className="block group/item">
                      <div className="relative aspect-3/4 overflow-hidden mb-4 bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover/item:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <h3 className="text-center text-sm md:text-base font-medium tracking-widest uppercase text-maroon line-clamp-1">
                          {item.title}
                        </h3>
                        {isProduct && item.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-maroon">
                              {item.price_after_discount || item.price} EGP
                            </span>
                            {item.price_after_discount && String(item.price_after_discount) !== String(item.price) && (
                              <span className="text-xs text-gray-400 line-through">
                                {item.price} EGP
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!isLoading && items.length > 0 && (
            <>
              <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className={`max-sm:hidden absolute left-[5px] lg:left-[10px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white! shadow-lg hidden md:flex items-center justify-center text-maroon z-50 transition-all hover:bg-maroon hover:text-white border border-maroon/10 ${
                  !prevBtnEnabled && "opacity-0 invisible"
                }`}
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className={`max-sm:hidden absolute right-[5px] lg:right-[10px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white! shadow-lg hidden md:flex items-center justify-center text-maroon z-20 transition-all hover:bg-maroon hover:text-white border border-maroon/10 ${
                  !nextBtnEnabled && "opacity-0 invisible"
                }`}
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

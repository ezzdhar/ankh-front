"use client";

import { Suspense } from "react";
import Image from "next/image";
import headerImg from "@/styles/ankh_header.png";
import { Filters } from "@/components/search/Filters";
import { ProductGrid } from "@/components/search/ProductGrid";
import { SortSelect } from "@/components/search/SortSelect";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { useIsMounted } from "@/hooks/useIsMounted";

export function SearchClient() {
  const { t } = useTranslation("search");
  const isMounted = useIsMounted();

  if (!isMounted) return <div className="bg-cream min-h-screen pt-[60px] pb-16" />;

  return (
    <div className="bg-cream min-h-screen">
      <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] mb-8 md:mb-12">
        <Image
          src={headerImg}
          alt="Search Header"
          fill
          className="object-cover object-[center_35%]"
          priority
        />
      </div>
      <div className="container mx-auto px-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-primary font-medium text-maroon tracking-wider uppercase">
            {t("title")}
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-[#310E0E]/90! text-[#310E0E]/90! bg-transparent rounded-full uppercase text-xs tracking-widest hover:bg-[#310E0E]/5 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <Filter size={16} /> {t("filters.title")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-cream w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="text-maroon uppercase tracking-widest text-left">
                      {t("filters.title")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <Suspense>
                      <Filters />
                    </Suspense>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Suspense>
              <SortSelect />
            </Suspense>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
            <Suspense>
              <Filters />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Suspense
              fallback={
                <div className="h-96 w-full animate-pulse bg-gray-100 rounded-lg"></div>
              }
            >
              <ProductGrid />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

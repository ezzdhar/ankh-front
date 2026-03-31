"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersProps {
  className?: string;
  closeMobileMenu?: () => void;
}

const RATES = [5, 4, 3, 2, 1];

export function Filters({ className, closeMobileMenu }: FiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Data fetching
  const { data: categoriesData } = useCategories(1, 50); // Fetch first 50 categories

  // Derived state from URL
  const selectedCategory = searchParams.get("category_id");
  const selectedRate = searchParams.get("rate")
    ? Number(searchParams.get("rate"))
    : null;

  // Local state for Price inputs (to allow typing before applying)
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get("min_price") || "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get("max_price") || "",
  );

  // Sync Price inputs with URL changes (e.g. Clear All)
  useEffect(() => {
    const newMin = searchParams.get("min_price") || "";
    const newMax = searchParams.get("max_price") || "";
    if (newMin !== minPrice) setMinPrice(newMin);
    if (newMax !== maxPrice) setMaxPrice(newMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  };

  const handlePriceChange = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (minPrice || maxPrice) {
      current.set("min_price", minPrice || "0");
      current.set("max_price", maxPrice || "0");
    } else {
      current.delete("min_price");
      current.delete("max_price");
    }

    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    if (closeMobileMenu) closeMobileMenu();

    // Reset local price state
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Accordion
        type="multiple"
        defaultValue={["categories", "sizes", "rates", "price"]}
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="categories" className="border-b border-maroon/20">
          <AccordionTrigger className="text-maroon uppercase tracking-wide text-sm font-bold hover:no-underline py-6">
            CATEGORIES
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 pb-6">
              {categoriesData?.data?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={() =>
                    updateFilter("category_id", category.id.toString())
                  }
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border border-maroon flex items-center justify-center transition-all",
                      selectedCategory === category.id.toString()
                        ? "bg-maroon"
                        : "bg-transparent group-hover:border-maroon/70",
                    )}
                  >
                    {selectedCategory === category.id.toString() && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-maroon transition-colors">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rates */}
        <AccordionItem value="rates" className="border-b border-maroon/20">
          <AccordionTrigger className="text-maroon uppercase tracking-wide text-sm font-bold hover:no-underline py-6">
            RATES
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 pb-6">
              {RATES.map((rate) => (
                <div
                  key={rate}
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={() => updateFilter("rate", rate.toString())}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border border-maroon flex items-center justify-center transition-all",
                      selectedRate === rate
                        ? "bg-maroon"
                        : "bg-transparent group-hover:border-maroon/70",
                    )}
                  >
                    {selectedRate === rate && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rate ? "currentColor" : "none"}
                        strokeWidth={i < rate ? 0 : 1.5}
                        className={i >= rate ? "text-gray-300" : ""}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-b border-maroon/20">
          <AccordionTrigger className="text-maroon uppercase tracking-wide text-sm font-bold hover:no-underline py-6">
            PRICE RANGE
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-4 pt-2 pb-6">
              <div className="flex-1">
                <label className="text-xs text-maroon/60 mb-1 block">Min</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={handlePriceChange}
                  className="h-10 rounded-full border-maroon/30 text-center"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-maroon/60 mb-1 block">Max</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={handlePriceChange}
                  className="h-10 rounded-full border-maroon/30 text-center"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        onClick={clearFilters}
        variant="outline"
        className="w-full mt-6 h-12 rounded-full border-maroon text-maroon hover:bg-maroon hover:text-white uppercase tracking-widest transition-colors"
      >
        Clear Filters
      </Button>
    </div>
  );
}

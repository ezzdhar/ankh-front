"use client";

import { useTranslation } from "@/i18n/hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock Data (Should be replaced by API data or props)
const CATEGORIES = [
  { id: "casual", label: "Casual Clothing" },
  { id: "formal", label: "Formal Wear" },
  { id: "soiree", label: "Soiree" },
  { id: "formal-soiree", label: "Formal Soiree" },
  { id: "balzers", label: "Balzers" },
];

const SIZES = [
  { id: "xxl", label: "XXL" },
  { id: "xl", label: "XL" },
  { id: "l", label: "L" },
  { id: "m", label: "M" },
  { id: "s", label: "S" },
  { id: "xs", label: "XS" },
];

const RATES = [5, 4, 3, 2, 1];

export function SidebarFilters() {
  const { t } = useTranslation("search");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to get current values
  const selectedCategories = searchParams.getAll("category_id");
  const selectedSizes = searchParams.getAll("size");
  const selectedRate = searchParams.get("rate")
    ? Number(searchParams.get("rate"))
    : null;
  const minPrice = searchParams.get("min_price")
    ? Number(searchParams.get("min_price"))
    : 0;
  const maxPrice = searchParams.get("max_price")
    ? Number(searchParams.get("max_price"))
    : 10000;

  // Local state for price inputs to allow typing before applying
  // Note: Parent component should key this component by searchParams to reset state on URL change
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const updateURL = (params: URLSearchParams) => {
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("category_id");
    if (current.includes(id)) {
      params.delete("category_id");
      current
        .filter((c) => c !== id)
        .forEach((c) => params.append("category_id", c));
    } else {
      params.append("category_id", id);
    }
    updateURL(params);
  };

  const handleSizeChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("size");
    if (current.includes(id)) {
      params.delete("size");
      current.filter((s) => s !== id).forEach((s) => params.append("size", s));
    } else {
      params.append("size", id);
    }
    updateURL(params);
  };

  const handleRateChange = (rate: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedRate === rate) {
      params.delete("rate");
    } else {
      params.set("rate", rate.toString());
    }
    updateURL(params);
  };

  const handlePriceChange = (value: number, index: 0 | 1) => {
    const newRange = [...localPriceRange] as [number, number];
    newRange[index] = value;
    setLocalPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("min_price", localPriceRange[0].toString());
    params.set("max_price", localPriceRange[1].toString());
    updateURL(params);
  };

  const clearFilters = () => {
    router.push("/search");
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={["categories", "sizes", "rates", "price"]}
      className="w-full lg:w-64 flex flex-col gap-6"
    >
      {/* Categories */}
      <AccordionItem value="categories">
        <AccordionTrigger className="text-base font-medium text-[#3A0F0E]">
          {t("filters.categories")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border border-[#3A0F0E] cursor-pointer ${selectedCategories.includes(cat.id) ? "bg-[#3A0F0E]" : "bg-transparent"}`}
                  onClick={() => handleCategoryChange(cat.id)}
                />
                <label
                  className="text-sm text-[#3A0F0E]/80 cursor-pointer"
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Sizes */}
      <AccordionItem value="sizes">
        <AccordionTrigger className="text-base font-medium text-[#3A0F0E]">
          {t("filters.sizes")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-3">
            {SIZES.map((size) => (
              <div key={size.id} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border border-[#3A0F0E] cursor-pointer ${selectedSizes.includes(size.id) ? "bg-[#3A0F0E]" : "bg-transparent"}`}
                  onClick={() => handleSizeChange(size.id)}
                />
                <label
                  className="text-sm text-[#3A0F0E]/80 cursor-pointer"
                  onClick={() => handleSizeChange(size.id)}
                >
                  {size.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Rates */}
      <AccordionItem value="rates">
        <AccordionTrigger className="text-base font-medium text-[#3A0F0E]">
          {t("filters.rates")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2">
            {RATES.map((rate) => (
              <div
                key={rate}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleRateChange(rate)}
              >
                <div
                  className={`w-4 h-4 rounded-full border border-[#3A0F0E] shrink-0 ${selectedRate === rate ? "bg-[#3A0F0E]" : "bg-transparent"}`}
                />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Price Range */}
      <AccordionItem value="price">
        <AccordionTrigger className="text-base font-medium text-[#3A0F0E]">
          {t("filters.priceRange")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
                className="h-9 text-sm"
                min={0}
              />
              <span className="text-[#3A0F0E]">-</span>
              <Input
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                className="h-9 text-sm"
                min={0}
              />
            </div>
            {/* Apply button for price is optional if we debounce, but explicit is good */}
            {/* Current logic uses onBlur-ish or we can add a small button or just let user trigger it via a hypothetical 'Apply' button if needed. 
                 For now, let's trigger update on blur of inputs if we added onBlur, or add a small Apply link. 
                 The image shows inputs. Let's assume auto-update or global apply. 
                 Actually the user request says "params... will be sent to backend".
                 Let's add a small apply button or just use onBlur.
             */}
            <button
              onClick={applyPriceFilter}
              className="text-xs underline text-[#3A0F0E] text-left hover:text-[#3A0F0E]/70"
            >
              {t("filters.applyPrice")}
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full mt-4 border-[#3A0F0E] text-[#3A0F0E] hover:bg-[#3A0F0E] hover:text-white"
        onClick={clearFilters}
      >
        {t("filters.clear")}
      </Button>
    </Accordion>
  );
}

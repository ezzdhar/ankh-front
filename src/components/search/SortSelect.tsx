"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/hooks";

export function SortSelect() {
  const { t } = useTranslation("search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort_by") || "latest";

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sort_by", value);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-maroon/70 whitespace-nowrap uppercase tracking-wider hidden sm:inline">
        {t("sort.label")}
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] border-maroon/20 text-maroon focus:ring-maroon/20">
          <SelectValue placeholder={t("sort.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">{t("sort.newest")}</SelectItem>
          <SelectItem value="price_low">{t("sort.priceLow")}</SelectItem>
          <SelectItem value="price_high">{t("sort.priceHigh")}</SelectItem>
          <SelectItem value="rating">{t("sort.rating")}</SelectItem>
          <SelectItem value="name">{t("sort.name")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function SortSelect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort_by") || "latest";

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sort_by", value);

    // Check if we need to reset page? Usually sorting doesn't require page reset but good practice to see top results
    // current.set("page", "1");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-maroon/70 whitespace-nowrap uppercase tracking-wider hidden sm:inline">
        Sort By:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] border-maroon/20 text-maroon focus:ring-maroon/20">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="price_low">Price: Low to High</SelectItem>
          <SelectItem value="price_high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="name">Name: A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

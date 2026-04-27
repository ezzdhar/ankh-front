"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/hooks";

interface PaginationProps {
  lastPage: number;
  currentPage: number;
}

export function Pagination({ lastPage, currentPage }: PaginationProps) {
  const { t } = useTranslation("search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage) return;

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", page.toString());

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  if (lastPage <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-12 h-12 border-[#310E0E]/90! text-[#310E0E]/90! bg-transparent rounded-full hover:bg-[#310E0E]/5 transition-all font-bold flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-maroon font-medium uppercase tracking-widest text-sm">
        {t("pagination.page")} {currentPage} {t("pagination.of")} {lastPage}
      </span>

      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="w-12 h-12 border-[#310E0E]/90! text-[#310E0E]/90! bg-transparent rounded-full hover:bg-[#310E0E]/5 transition-all font-bold flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

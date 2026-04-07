"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "./Pagination";
import { Loader2 } from "lucide-react";
import { ProductSearchParams } from "@/types/product";
import { useTranslation } from "@/i18n/hooks";

export function ProductGrid() {
  const { t } = useTranslation("search");
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("category_id");
  const brandId = searchParams.get("brand_id");

  const params: ProductSearchParams = {
    search: searchParams.get("search") || undefined,
    sort_by: searchParams.get("sort_by") || undefined,
    per_page: searchParams.get("per_page") || 12,
    page: searchParams.get("page") || 1,
    category_id: categoryId ? parseInt(categoryId) : undefined,
    brand_id: brandId ? parseInt(brandId) : undefined,
    min_price: searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : undefined,
    max_price: searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : undefined,
    rating: searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : undefined,
    // in_stock_only: searchParams.get("in_stock_only") === "true",
    // has_discount_only: searchParams.get("has_discount_only") === "true",
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 w-full">
        <Loader2 className="h-10 w-10 animate-spin text-maroon" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 w-full text-maroon">
        <p className="text-lg font-medium mb-2">Error loading products.</p>
        <p className="text-sm opacity-70">{(error as Error).message}</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 w-full text-maroon">
        <p className="text-lg font-medium tracking-wide uppercase">
          {t("noResults")}
        </p>
        <p className="text-sm opacity-70 mt-2">
          {t("noResultsHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {data.paginate && (
        <p className="mb-6 text-sm text-maroon/60">
          Showing {data.data.length} results
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {data.paginate && (
        <Pagination
          lastPage={data.paginate.last_page}
          currentPage={data.paginate.current_page}
        />
      )}
    </div>
  );
}

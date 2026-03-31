"use client";

import { useTranslation } from "@/i18n/hooks";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useFavorites } from "@/hooks/useFavorite";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}

function WishlistContent() {
  const { t, i18n } = useTranslation("wishlist");
  const isRTL = i18n.language === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const { data: favoritesResponse, isLoading } = useFavorites(
    currentPage,
    perPage,
  );

  const favoriteItems = favoritesResponse?.data || [];
  // Support pagination if the API returns it in the 'paginate' field (as per ApiResponse type)
  // or default to 1 page if null.
  const paginate = favoritesResponse?.paginate;
  const totalPages = paginate?.last_page || 1;

  if (isLoading) {
    return (
      <div className="bg-[#FFF8EF] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <h1 className="text-[40px] font-medium text-[#3A0F0E] text-center mb-10 font-cormorant">
          {t("title")}
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-20">
          {favoriteItems.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.product.slug || item.product.id.toString(), // Use slug for link if available
                title: item.product.name,
                price: `${item.product.price_after_discount || item.product.price} EGP`,
                image:
                  item.product.main_image ||
                  item.product.image ||
                  (item.product.images?.[0]
                    ? typeof item.product.images[0] === "string"
                      ? item.product.images[0]
                      : item.product.images[0]?.url
                    : ""),
              }}
            />
          ))}
        </div>

        {favoriteItems.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl">{t("empty") || "Your wishlist is empty."}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              className="w-10 h-10 rounded-full border border-[#3A0F0E]/20 flex items-center justify-center text-[#3A0F0E] hover:bg-[#3A0F0E] hover:text-white transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {isRTL ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentPage === i + 1
                    ? "bg-[#3A0F0E] text-white"
                    : "text-[#3A0F0E] hover:bg-[#3A0F0E]/10",
                )}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="w-10 h-10 rounded-full border border-[#3A0F0E]/20 flex items-center justify-center text-[#3A0F0E] hover:bg-[#3A0F0E] hover:text-white transition-colors disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {isRTL ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

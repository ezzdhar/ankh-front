"use client";

import { useTranslation } from "@/i18n/hooks";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useFavorites } from "@/hooks/useFavorite";
import { useRandomProducts } from "@/hooks/useProducts";
import { CollectionCarousel } from "@/components/home/CollectionCarousel";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <WishlistContent />
  );
}

function WishlistContent() {
  const { t, i18n } = useTranslation("wishlist");
  const isMounted = useIsMounted();
  const isRTL = i18n.language === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const { data: favoritesResponse, isLoading } = useFavorites(
    currentPage,
    perPage,
  );
  const { data: randomData } = useRandomProducts();

  const favoriteItems = favoritesResponse?.data || [];
  // Support pagination if the API returns it in the 'paginate' field (as per ApiResponse type)
  // or default to 1 page if null.
  const paginate = favoritesResponse?.paginate;
  const totalPages = paginate?.last_page || 1;

  const justForYouItems = useMemo(() => {
    if (!randomData?.data) return [];
    return randomData.data.map((p) => ({
      id: p.id,
      image: p.main_image || p.image || (p.images && p.images[0]?.url) || "",
      title: p.name,
      price: p.price,
      price_after_discount: p.price_after_discount,
      link: `/product/${p.slug || p.id}`,
    }));
  }, [randomData]);

  if (isLoading) {
    return <Loader minHeight="min-h-screen" size="lg" />;
  }

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <h1 className="text-[40px] font-medium text-[#3A0F0E] text-center mb-10 font-cormorant uppercase tracking-widest">
          {t("title", { lng: isMounted ? undefined : "en" })}
        </h1>

        {favoriteItems.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {favoriteItems
                .filter((item) => item.product)
                .map((item) => (
                  <ProductCard
                    key={item.id}
                    product={{
                      id: item.product?.slug || item.product?.id?.toString() || "",
                      title: item.product?.name || "",
                      price: `${item.product?.price_after_discount || item.product?.price || 0} EGP`,
                      image:
                        item.product?.main_image ||
                        item.product?.image ||
                        (item.product?.images?.[0]
                          ? typeof item.product.images[0] === "string"
                            ? item.product.images[0]
                            : item.product.images[0]?.url
                          : ""),
                    }}
                  />
                ))}
            </div>

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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm space-y-6 animate-in zoom-in-95 fade-in duration-700">
            <div className="w-20 h-20 rounded-full bg-[#310E0E]/5 flex items-center justify-center text-[#310E0E]">
              <Heart size={40} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-medium text-[#3A0F0E] font-cormorant">
                {t("empty.title", { lng: isMounted ? undefined : "en" })}
              </h2>
              <p className="text-[#3A0F0E]/60 max-w-xs mx-auto">
                {t("empty.description", { lng: isMounted ? undefined : "en" })}
              </p>
            </div>
            <Button
              asChild
              className="bg-[#310E0E]! hover:bg-[#310E0E]/90! text-white! rounded-full px-12"
            >
              <Link href="/search">
                {t("empty.button", { lng: isMounted ? undefined : "en" })}
              </Link>
            </Button>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-20">
          <CollectionCarousel
            title={t("justForYou", { lng: isMounted ? undefined : "en" })}
            items={justForYouItems}
            isProduct={true}
          />
        </div>
      </div>
    </div>
  );
}


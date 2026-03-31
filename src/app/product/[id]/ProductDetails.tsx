"use client";

import { useTranslation } from "@/i18n/hooks";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ReviewModal } from "@/components/product/ReviewModal";
import { CollectionCarousel } from "@/components/home/CollectionCarousel";
import { useProduct, useRandomProducts } from "@/hooks/useProducts";
import { useState, useMemo } from "react";

export function ProductDetails({ id }: { id: string }) {
  const { t } = useTranslation("product");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: productData, isLoading } = useProduct(id);
  const { data: randomData } = useRandomProducts();

  const product = productData?.data;

  const justForYouItems = useMemo(() => {
    if (!randomData?.data) return [];
    return randomData.data.map((p) => ({
      id: p.id,
      image: p.main_image || p.image,
      title: p.name,
      link: `/product/${p.id}`,
    }));
  }, [randomData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] flex items-center justify-center">
        <p className="text-[#3A0F0E]">{t("productNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <ProductInfo product={product} />

        <ProductReviews
          productId={product.id}
          onWriteReview={() => setIsReviewModalOpen(true)}
        />

        <CollectionCarousel title={t("justForYou")} items={justForYouItems} />
      </main>

      <ReviewModal
        productId={product.id}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}

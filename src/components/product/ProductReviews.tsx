import { useTranslation } from "@/i18n/hooks";
import { Star, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useReviews } from "@/hooks/useReview";
import { useState } from "react";

interface ProductReviewsProps {
  productId: number | string;
  onWriteReview: () => void;
}

export function ProductReviews({
  productId,
  onWriteReview,
}: ProductReviewsProps) {
  const { t } = useTranslation("product");
  const [perPage, setPerPage] = useState(4);
  const { data: reviewsData, isLoading } = useReviews(productId);

  const reviews = reviewsData?.data?.data || [];
  const hasMore = reviewsData?.data
    ? reviews.length < reviewsData.data.total
    : false;

  const handleViewMore = () => {
    setPerPage((prev) => prev + 4);
  };

  if (isLoading && perPage === 4) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#FFF8EF] py-4">
      {/* Header */}
      <div className="flex justify-between items-baseline px-2">
        <h2 className="text-xl md:text-2xl font-medium text-[#3A0F0E] font-cormorant leading-tight">
          {t("reviews.title")}
        </h2>
        <button
          onClick={onWriteReview}
          className="text-sm text-[#3A0F0E] underline hover:opacity-70 transition-opacity font-medium"
        >
          {t("reviews.writeReview")}
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#EBE5E0] p-6 flex flex-col items-center text-center space-y-4 rounded-sm"
          >
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-gray-200 flex items-center justify-center shrink-0">
              {review.user?.avatar ? (
                <Image
                  src={review.user.avatar}
                  alt={review.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>

            {/* Rating */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    "transition-colors",
                    i < review.rating
                      ? "fill-[#3A0F0E] text-[#3A0F0E]"
                      : "fill-transparent text-[#3A0F0E] opacity-20",
                  )}
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-xs md:text-sm text-[#3A0F0E] leading-relaxed line-clamp-4">
              {review.comment}
            </p>

            {/* Name */}
            <div className="mt-auto pt-2">
              <span className="text-[10px] md:text-xs font-medium text-[#3A0F0E] opacity-70">
                {review.user?.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-10 opacity-50">
          <p>{t("reviews.noReviews") || "No reviews yet."}</p>
        </div>
      )}

      {/* View More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleViewMore}
            disabled={isLoading}
            className="text-sm font-medium text-[#3A0F0E] underline hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "..." : t("reviews.viewAll")}
          </button>
        </div>
      )}
    </div>
  );
}

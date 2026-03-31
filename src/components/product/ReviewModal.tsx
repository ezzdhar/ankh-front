import { useTranslation } from "@/i18n/hooks";
import { Star, X, AlignLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useStoreReview } from "@/hooks/useReview";

interface ReviewModalProps {
  productId: number | string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ productId, isOpen, onClose }: ReviewModalProps) {
  const { t } = useTranslation("product");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const storeReview = useStoreReview();

  const handleSubmit = () => {
    storeReview.mutate(
      {
        product_id: productId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FFF8EF] w-full max-w-2xl rounded-sm shadow-2xl border border-[#3A0F0E]/5 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 md:p-12 space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-medium text-[#3A0F0E] font-cormorant">
              {t("reviews.writeReview")}
            </h2>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={48}
                    className={cn(
                      "transition-colors",
                      (hoveredRating || rating) >= star
                        ? "fill-[#FFB800] text-[#FFB800]"
                        : "fill-[#D1D5DB] text-[#D1D5DB]",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#3A0F0E]">
              <AlignLeft size={20} className="opacity-70" />
              <span className="text-lg font-medium font-cormorant">
                {t("reviews.writeYourReview") || "Write Your Review"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-40 p-6 bg-[#FCF7F1] border border-[#3A0F0E]/20 rounded-2xl focus:ring-1 focus:ring-[#3A0F0E] focus:outline-none transition-all text-sm text-[#3A0F0E] placeholder:text-[#3A0F0E]/40 font-cairo resize-none"
                placeholder={
                  t("reviews.placeholder") ||
                  "What do you think about this product?"
                }
              />
              <div className="flex justify-end">
                <span
                  className={cn(
                    "text-xs transition-colors pr-2",
                    comment.length > 0 && comment.length < 20
                      ? "text-red-500 font-medium"
                      : "text-[#3A0F0E]/40",
                  )}
                >
                  {comment.length}/20{" "}
                  {t("reviews.minChars") || "min characters"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <Button
              className="h-12 px-12 bg-[#310E0E]! hover:bg-[#310E0E]/90! text-white text-sm font-medium rounded-full shadow-lg transition-all"
              onClick={handleSubmit}
              isLoading={storeReview.isPending}
              disabled={comment.length < 20 || storeReview.isPending}
            >
              {t("reviews.submit")}
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#3A0F0E]/5 rounded-full transition-colors hidden sm:block"
        >
          <X size={20} className="text-[#3A0F0E] opacity-40" />
        </button>
      </div>
    </div>
  );
}

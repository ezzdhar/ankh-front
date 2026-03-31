"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { CartItem } from "@/hooks/useCart";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, q: number) => void;
  onRemove: (id: number) => void;
  isUpdating?: boolean;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemCardProps) {
  const { t } = useTranslation("cart");
  const imageSrc =
    item.product.images && item.product.images.length > 0
      ? typeof item.product.images[0] === "string"
        ? item.product.images[0]
        : item.product.images[0]?.url
      : item.product.main_image || item.product.image || "";

  return (
    <div className="bg-[#FFF8EF] border border-[#3A0F0E]/10 rounded-lg p-6 flex flex-col items-start sm:flex-row gap-6 relative shadow-sm">
      {/* Image */}
      <div className="relative w-32 aspect-3/4 shrink-0 overflow-hidden rounded-md bg-gray-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-6">
        {/* Left Column: Title & Unit Price */}
        <div className="flex flex-col justify-center space-y-4">
          <h3 className="text-base font-medium text-[#3A0F0E] uppercase tracking-wide font-cormorant leading-tight max-w-[200px]">
            {item.product.name}
          </h3>
          <div className="text-xl font-medium text-[#A32020] font-cormorant">
            {parseFloat(item.unit_price).toFixed(0)} EGP
          </div>
        </div>

        {/* Right Column: Quantity, Total, Delete | Variants */}
        <div className="flex flex-col justify-center gap-6 sm:items-end">
          {/* Top Row: Quantity, Total, Delete */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Quantity Pill */}
            <div className="flex items-center border border-[#3A0F0E] rounded-full h-10 w-32 justify-center px-4 bg-white/50 relative overflow-hidden">
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-[#3A0F0E] border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="text-[#3A0F0E] hover:opacity-70 transition-opacity"
                    disabled={isUpdating}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-[#3A0F0E] font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="text-[#3A0F0E] hover:opacity-70 transition-opacity"
                    disabled={isUpdating}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="whitespace-nowrap">
              <span className="text-sm font-medium text-[#3A0F0E]">
                {t("items.total") || "Total"}:{" "}
                {parseFloat(item.total_price).toFixed(0)} EGP
              </span>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="text-[#A32020] hover:bg-[#A32020]/5 p-2 rounded-full transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Bottom Row: Variants */}
          <div className="flex items-center gap-8 md:gap-12">
            {/* Color */}
            {item.product_variant.name && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#3A0F0E] font-medium">
                  {t("items.color") || "Color"}*
                </span>
                {/* Try to use color code if available, else fallback to name or standard color */}
                <div
                  className="w-8 h-8 rounded-full shadow-sm border border-black/10"
                  style={{
                    backgroundColor: item.product_variant.color_code,
                  }}
                  title={item.product_variant.name}
                />
              </div>
            )}

            {/* Size */}
            {item.product_variant.size_name && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#3A0F0E] font-medium">
                  {t("items.size") || "Size"}*
                </span>
                <div className="w-8 h-8 rounded-full border border-[#3A0F0E] flex items-center justify-center text-xs font-medium text-[#3A0F0E] uppercase">
                  {item.product_variant.size_name}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

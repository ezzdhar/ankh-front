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
    <div className="bg-[#FFF8EF] border border-[#3A0F0E]/10 rounded-lg p-3 sm:p-6 flex gap-4 sm:gap-6 relative shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative w-24 sm:w-32 aspect-3/4 shrink-0 overflow-hidden rounded-md bg-gray-100">
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
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm sm:text-base font-medium text-[#3A0F0E] uppercase tracking-wide font-cormorant leading-tight line-clamp-2">
              {item.product.name}
            </h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-[#A32020] hover:bg-[#A32020]/10 p-1.5 rounded-full transition-colors shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            {item.product_variant?.attribute_values && item.product_variant.attribute_values.length > 0 ? (
              item.product_variant.attribute_values.map((attr) => (
                <div key={attr.id} className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs text-[#3A0F0E]/60 font-medium">
                    {attr.attribute.name}:
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#3A0F0E] font-semibold uppercase tracking-tight">
                    {attr.name}
                  </span>
                  {attr.color_code && (attr.color_code.startsWith("#") || attr.color_code.startsWith("rgb")) && (
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: attr.color_code }}
                    />
                  )}
                </div>
              ))
            ) : (
              /* Fallback for variants without attribute_values array structure */
              <>
                {item.product_variant?.color_code && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-[#3A0F0E]/60 font-medium">
                      {t("items.color") || "Color"}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#3A0F0E] font-semibold uppercase">
                      {item.product_variant.color_code}
                    </span>
                  </div>
                )}
                {item.product_variant?.size_name && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-[#3A0F0E]/60 font-medium">
                      {t("items.size") || "Size"}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#3A0F0E] font-semibold uppercase">
                      {item.product_variant.size_name}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-medium text-[#A32020] font-cormorant">
                {parseFloat(item.unit_price).toFixed(2)} EGP
              </span>
              {item.product.original_price && Number(item.product.original_price) > Number(item.unit_price) && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {Number(item.product.original_price).toFixed(2)} EGP
                </span>
              )}
            </div>
            {item.quantity > 1 && (
              <span className="block text-[9px] sm:text-[10px] text-[#3A0F0E]/40 uppercase tracking-widest">
                {parseFloat(item.unit_price).toFixed(2)} x {item.quantity} = {parseFloat(item.total_price).toFixed(2)} EGP
              </span>
            )}
          </div>

          <div className="flex items-center border border-[#3A0F0E] rounded-full h-8 sm:h-10 w-28 sm:w-32 justify-center px-3 bg-white/50 relative overflow-hidden">
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-[#3A0F0E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="text-[#3A0F0E] hover:opacity-70 transition-opacity p-1"
                  disabled={isUpdating}
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs sm:text-sm text-[#3A0F0E] font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="text-[#3A0F0E] hover:opacity-70 transition-opacity p-1"
                  disabled={isUpdating}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

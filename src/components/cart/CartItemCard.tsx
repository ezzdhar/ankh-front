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
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-medium text-[#A32020] font-cormorant">
                {parseFloat(item.unit_price).toFixed(2)} EGP
              </span>
              {item.product.original_price && Number(item.product.original_price) > Number(item.unit_price) && (
                <span className="text-sm text-gray-400 line-through">
                  {Number(item.product.original_price).toFixed(2)} EGP
                </span>
              )}
            </div>
            {item.quantity > 1 && (
              <span className="text-[10px] text-[#3A0F0E]/40 uppercase tracking-widest">
                {parseFloat(item.unit_price).toFixed(2)} x {item.quantity}
              </span>
            )}
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
                {parseFloat(item.total_price).toFixed(2)} EGP
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

          {/* Bottom Row: Variants Selection */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-2">
            {item.product_variant?.attribute_values && item.product_variant.attribute_values.length > 0 ? (
              item.product_variant.attribute_values.map((attr) => (
                <div key={attr.id} className="flex items-center gap-2">
                  <span className="text-xs text-[#3A0F0E]/60 font-medium">
                    {attr.attribute.name}:
                  </span>
                  <span className="text-xs text-[#3A0F0E] font-semibold uppercase tracking-tight">
                    {attr.name}
                  </span>
                  {attr.color_code && (attr.color_code.startsWith("#") || attr.color_code.startsWith("rgb")) && (
                    <div
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: attr.color_code }}
                    />
                  )}
                </div>
              ))
            ) : (
              /* Fallback for variants without attribute_values array structure */
              <>
                {item.product_variant?.color_code && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#3A0F0E]/60 font-medium">
                      {t("items.color") || "Color"}
                    </span>
                    <span className="text-xs text-[#3A0F0E] font-semibold uppercase">
                      {item.product_variant.color_code}
                    </span>
                  </div>
                )}
                {item.product_variant?.size_name && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#3A0F0E]/60 font-medium">
                      {t("items.size") || "Size"}
                    </span>
                    <span className="text-xs text-[#3A0F0E] font-semibold uppercase">
                      {item.product_variant.size_name}
                    </span>
                  </div>
                )}
                {!item.product_variant?.color_code && !item.product_variant?.size_name && item.product_variant?.name && (
                   <span className="text-xs text-[#3A0F0E]/60 font-medium uppercase tracking-widest">
                    {item.product_variant.name}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

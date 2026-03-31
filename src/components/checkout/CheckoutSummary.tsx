"use client";

import { useTranslation } from "@/i18n/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { CartItem } from "@/hooks/useCart";

interface CheckoutSummaryProps {
  items: CartItem[];
  totalPieces: number;
  totalCost: number;
  discount: number;
  vat: number;
  shipping: number;
  finalTotal: number;
  onPayNow: () => void;
  isSubmitting?: boolean;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  isApplyingCoupon?: boolean;
}

export function CheckoutSummary({
  items,
  totalPieces,
  totalCost,
  discount,
  vat,
  shipping,
  finalTotal,
  onPayNow,
  isSubmitting,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
}: CheckoutSummaryProps) {
  const { t } = useTranslation(["cart", "checkout"]);
  const [promoCode, setPromoCode] = useState(couponCode || "");

  useEffect(() => {
    if (couponCode !== undefined && couponCode !== promoCode) {
      setPromoCode(couponCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode]);

  const handleApplyCoupon = () => {
    if (onApplyCoupon && promoCode) {
      onApplyCoupon(promoCode);
    }
  };

  return (
    <div className="bg-[#FFF8EF] border border-[#3A0F0E]/10 rounded-lg p-6 md:p-8 space-y-6">
      <h2 className="text-2xl md:text-3xl font-medium text-[#3A0F0E] font-cormorant">
        {t("cart:summary.title")}
      </h2>

      {/* Items List */}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-20 aspect-3/4 shrink-0 overflow-hidden rounded-md bg-gray-100">
              {item.product.main_image ||
              item.product.image ||
              (item.product.images?.[0]
                ? typeof item.product.images[0] === "string"
                  ? item.product.images[0]
                  : item.product.images[0]?.url
                : "") ? (
                <Image
                  src={
                    item.product.main_image ||
                    item.product.image ||
                    (typeof item.product.images?.[0] === "string"
                      ? item.product.images[0]
                      : item.product.images?.[0]?.url) ||
                    ""
                  }
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  {t("cart:empty.noImage")}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xs md:text-sm font-medium text-[#3A0F0E] uppercase tracking-wide">
                {item.product.name}
              </h3>
              <div className="text-base font-bold text-[#A32020] font-cormorant">
                {parseFloat(item.unit_price).toFixed(0)} EGP
              </div>
              <div className="text-xs text-[#3A0F0E]/60">
                {t("cart:items.quantity")}: {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#3A0F0E]/10 my-6" />

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E] opacity-80">
            {t("cart:summary.totalPieces")}
          </span>
          <span className="text-[#3A0F0E] font-medium text-lg">
            {totalPieces}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E] opacity-80">
            {t("cart:summary.totalCost")}
          </span>
          <span className="text-[#3A0F0E] font-medium">
            {totalCost.toFixed(0)} EGP
          </span>
        </div>
      </div>

      <div className="h-px bg-[#3A0F0E]/10 my-6" />

      {/* Coupon Section */}
      <div className="space-y-3">
        <label className="text-sm text-[#3A0F0E] opacity-80 block">
          {t("cart:summary.promoCode")}
        </label>
        <div className="relative flex items-center">
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder={t("cart:summary.applyCoupon")}
            className="pr-24 bg-[#EAE0D5]/50 border-none h-12 rounded-md focus-visible:ring-1 focus-visible:ring-[#3A0F0E]/20"
            disabled={!!couponCode}
          />
          {couponCode ? (
            <Button
              onClick={onRemoveCoupon}
              variant="ghost"
              size="sm"
              className="absolute right-1 text-[#A32020] hover:text-[#A32020]/80 h-10 px-3"
              disabled={isApplyingCoupon}
            >
              <X size={16} className="mr-1" /> {t("cart:summary.remove")}
            </Button>
          ) : (
            <Button
              onClick={handleApplyCoupon}
              className="absolute right-0 top-0 bottom-0 bg-[#310E0E] hover:bg-[#310E0E]/90 text-white rounded-l-none rounded-r-md px-6 h-12 uppercase text-xs tracking-widest font-bold"
              disabled={isApplyingCoupon || !promoCode}
            >
              {isApplyingCoupon ? "..." : t("cart:summary.apply")}
            </Button>
          )}
        </div>
      </div>

      <div className="h-px bg-[#3A0F0E]/10 my-6" />

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E] opacity-80">
            {t("cart:summary.discount")}
          </span>
          <span className="text-[#3A0F0E] font-medium">
            {discount.toFixed(0)} EGP-
          </span>
        </div>
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E] opacity-80">
            {t("cart:summary.vatAmount")}
          </span>
          <span className="text-[#3A0F0E] font-medium">
            {vat.toFixed(0)} EGP
          </span>
        </div>

        {/* Only show Shipping if > 0 */}
        {shipping > 0 && (
          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="text-[#3A0F0E] opacity-80">
              {t("cart:summary.shipping")}
            </span>
            <span className="text-[#3A0F0E] font-medium">
              {shipping.toFixed(0)} EGP
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <span className="text-base md:text-lg font-medium text-[#3A0F0E] opacity-80">
            {t("cart:summary.finalTotal")}
          </span>
          <span className="text-base md:text-lg font-medium text-[#3A0F0E] font-cormorant">
            {finalTotal.toFixed(0)} EGP
          </span>
        </div>

        <p className="text-[10px] text-[#3A0F0E] opacity-60">
          {t("cart:summary.vatInclusive")}
        </p>
      </div>

      <div className="flex bg-[#FCF7F1]/0 gap-4 pt-4">
        <Button
          asChild
          variant="outline"
          className="flex-1 h-12 border-[#3A0F0E] text-[#3A0F0E] bg-transparent rounded-full uppercase text-xs tracking-widest hover:bg-[#3A0F0E]/5 transition-all font-bold"
        >
          <Link href="/" className="w-full text-center py-3">
            {t("cart:summary.continueShopping")}
          </Link>
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={onPayNow}
          className="flex-1 h-12 bg-[#310E0E] hover:bg-[#310E0E]/90 text-white rounded-full uppercase text-xs tracking-widest transition-all font-bold"
        >
          {isSubmitting ? "..." : t("checkout:payment.payNow")}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useTranslation } from "@/i18n/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface OrderSummaryProps {
  totalPieces: number;
  totalCost: number;
  discount: number;
  vat: number;
  finalTotal: number;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  isApplyingCoupon?: boolean;
}

export function OrderSummary({
  totalPieces,
  totalCost,
  discount,
  vat,
  finalTotal,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
}: OrderSummaryProps) {
  const { t } = useTranslation("cart");
  const [promoCode, setPromoCode] = useState("");

  return (
    <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-lg p-6 md:p-8 space-y-8 h-fit">
      <h2 className="text-2xl md:text-3xl font-medium text-[#3A0F0E] font-cormorant border-b border-[#3A0F0E]/10 pb-4">
        {t("summary.title") || "Order Summary"}
      </h2>

      <div className="space-y-4 pb-2">
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E]">
            {t("summary.totalPieces") || "Total Pieces"}
          </span>
          <span className="text-[#3A0F0E] font-medium">{totalPieces}</span>
        </div>
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E] whitespace-nowrap">
            {t("summary.totalCost") || "Total Cost (Without Tax)"}
          </span>
          <span className="text-[#3A0F0E] font-medium">
            {totalCost.toFixed(0)} LE
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm text-[#3A0F0E] block">
          {t("summary.promoCode") || "Do you have a promo code"}
        </label>
        {couponCode ? (
          <div className="flex items-center justify-between bg-[#0fa47f]/10 px-4 py-3 rounded-md border border-[#0fa47f]/20">
            <span className="text-sm font-medium text-[#0fa47f]">
              {couponCode} Applied
            </span>
            <button
              onClick={onRemoveCoupon}
              className="text-[#A32020] hover:bg-[#A32020]/10 p-1 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="flex overflow-hidden rounded-md bg-[#EBE5E0] shadow-inner">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t("summary.applyCoupon") || "Apply Coupon"}
              className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-[#3A0F0E]/40 text-[#3A0F0E]"
            />
            <button
              onClick={() => onApplyCoupon?.(promoCode)}
              disabled={isApplyingCoupon || !promoCode}
              className="bg-[#310E0E] text-white px-6 py-3 text-xs font-medium uppercase tracking-widest hover:bg-[#4a1818] disabled:opacity-50 transition-colors"
            >
              {isApplyingCoupon ? "..." : t("summary.apply") || "Apply"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-[#3A0F0E]/10">
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E]">
            {t("summary.discount") || "Discount"}
          </span>
          <span className="text-[#3A0F0E] font-medium">
            {discount.toFixed(0)} EGP-
          </span>
        </div>
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[#3A0F0E]">
            {t("summary.vatAmount") || "VAT Tax Amount"}
          </span>
          <span className="text-[#3A0F0E] font-medium">
            {vat.toFixed(0)} EGP
          </span>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-base md:text-lg font-medium text-[#3A0F0E]">
            {t("summary.finalTotal") || "Final Total Amount"}
          </span>
          <span className="text-xl md:text-2xl font-bold text-[#3A0F0E]">
            {finalTotal.toFixed(0)} EGP
          </span>
        </div>

        <p className="text-[10px] text-[#3A0F0E] opacity-50 uppercase tracking-wider">
          {t("summary.vatInclusive") || "VAT Inclusive*"}
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button
          asChild
          className="w-full h-12 bg-[#310E0E]! hover:bg-[#310E0E]/90! text-white! rounded-full uppercase text-xs tracking-widest transition-all font-bold"
        >
          <Link href="/checkout" className="w-full text-center">
            {t("summary.checkout") || "Proceed To Checkout"}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full h-12 border-[#3A0F0E] text-[#3A0F0E] bg-transparent rounded-full uppercase text-xs tracking-widest hover:bg-[#3A0F0E]/5 transition-all font-bold"
        >
          <Link href="/" className="w-full text-center">
            {t("summary.continueShopping") || "Continue Shopping"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

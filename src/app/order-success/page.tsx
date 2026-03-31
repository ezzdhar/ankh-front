"use client";

import { useTranslation } from "@/i18n/hooks";
import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderData {
  orderNumber: string | number;
  items: OrderItem[];
  totalPieces: number;
  totalCost: number;
  discount: number;
  vat: number;
  finalTotal: number;
}

export default function OrderSuccessPage() {
  const { t } = useTranslation(["checkout", "cart"]);
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lastOrder");
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Success Banner */}
        <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-[#3A0F0E] flex items-center justify-center mx-auto">
            <Check
              size={40}
              className="md:size-60 text-[#3A0F0E]"
              strokeWidth={1}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-medium text-[#3A0F0E]">
              {t("checkout:success.title")}
            </h1>
            <p className="text-sm md:text-base text-[#3A0F0E]/60 max-w-md mx-auto">
              {t("checkout:success.thankYou")}
            </p>
          </div>
          {order?.orderNumber && (
            <div className="text-xl md:text-2xl font-medium text-[#3A0F0E] pt-4">
              {t("checkout:success.orderNumberLabel")} #{order.orderNumber}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {order && order.items.length > 0 && (
          <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm p-6 md:p-8 space-y-8">
            <h2 className="text-2xl font-medium text-[#3A0F0E] font-cormorant">
              {t("cart:summary.title")}
            </h2>

            {/* Items List */}
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-6">
                  <div className="relative w-20 aspect-3/4 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-medium text-[#3A0F0E] uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <div className="text-lg font-bold text-[#A32020]">
                      {item.price} EGP
                    </div>
                    <div className="text-xs text-[#3A0F0E]/50">
                      {t("cart:quantity")}: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-[#3A0F0E]/10">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-[#3A0F0E] opacity-70">
                  {t("cart:summary.totalPieces")}
                </span>
                <span className="text-[#3A0F0E] font-medium">
                  {order.totalPieces}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-[#3A0F0E] opacity-70">
                  {t("cart:summary.totalCost")}
                </span>
                <span className="text-[#3A0F0E] font-medium">
                  {order.totalCost.toFixed(2)} EGP
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#3A0F0E]/10">
              {order.discount > 0 && (
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-[#3A0F0E] opacity-70">
                    {t("cart:summary.discount")}
                  </span>
                  <span className="text-green-600 font-medium">
                    -{order.discount.toFixed(2)} EGP
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-[#3A0F0E] opacity-70">
                  {t("cart:summary.vatAmount")}
                </span>
                <span className="text-[#3A0F0E] font-medium">
                  {order.vat.toFixed(2)} EGP
                </span>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-lg md:text-xl font-medium text-[#3A0F0E]">
                  {t("cart:summary.finalTotal")}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-[#3A0F0E]">
                  {order.finalTotal.toFixed(2)} EGP
                </span>
              </div>

              <p className="text-[10px] text-[#3A0F0E] opacity-50 italic">
                {t("cart:summary.vatInclusive")}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                asChild
                variant="outline"
                className="flex-1 h-12 border-[#3A0F0E] text-[#3A0F0E] rounded-full uppercase text-xs tracking-widest hover:bg-[#3A0F0E] hover:text-white! transition-all font-medium"
              >
                <Link href="/">{t("checkout:success.continueShopping")}</Link>
              </Button>
              <Button
                asChild
                className="flex-1 h-12 bg-[#310E0E]! hover:bg-[#310E0E]/90! text-white! rounded-full uppercase text-xs tracking-widest transition-all font-bold"
              >
                <Link href="/orders">{t("checkout:success.viewOrder")}</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

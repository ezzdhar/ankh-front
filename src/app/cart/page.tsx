"use client";

import { useTranslation } from "@/i18n/hooks";
import { useMemo, useState } from "react";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CollectionCarousel } from "@/components/home/CollectionCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useApplyCoupon,
  useRemoveCoupon,
} from "@/hooks/useCart";
import { useRandomProducts } from "@/hooks/useProducts";

export default function CartPage() {
  const { t } = useTranslation("cart");
  const { data: cartData, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const { data: randomData } = useRandomProducts();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const items = useMemo(
    () => cartData?.data?.items || [],
    [cartData?.data?.items],
  );
  const cart = cartData?.data;

  // ... (calculations omitted for brevity, they remain unchanged) ...
  // Calculate totals from items since backend might return 0/null for root totals
  const { subTotal, totalDiscount, tax, finalTotal } = useMemo(() => {
    if (!items.length) {
      return { subTotal: 0, totalDiscount: 0, tax: 0, finalTotal: 0 };
    }

    const calculatedSubTotal = items.reduce((acc, item) => {
      // original_price is usually the higher one (before discount)
      const originalPrice = parseFloat(
        item.product_variant?.price ||
          item.product?.original_price?.toString() ||
          item.product?.price?.toString() ||
          item.unit_price,
      );
      return acc + originalPrice * item.quantity;
    }, 0);

    const calculatedSellingTotal = items.reduce((acc, item) => {
      return acc + parseFloat(item.unit_price) * item.quantity;
    }, 0);

    // Product level discounts (Original Sum - Selling Sum)
    const productDiscount = calculatedSubTotal - calculatedSellingTotal;

    // Coupon discount from backend (if provided in root)
    const cartDiscountAmount = parseFloat(cart?.discount_amount || "0");

    // Total discount displayed = Product Discount + Coupon Discount
    const totalDiscount = productDiscount + cartDiscountAmount;

    const taxAmount = parseFloat(cart?.tax_amount || "0");

    // Final Total Calculation:
    // Selling Total (already discounted by product offers) - Coupon Discount + Tax
    const calculatedFinalTotal =
      calculatedSellingTotal - cartDiscountAmount + taxAmount;

    return {
      subTotal: calculatedSubTotal,
      totalDiscount: totalDiscount,
      tax: taxAmount,
      finalTotal: calculatedFinalTotal,
    };
  }, [items, cart?.discount_amount, cart?.tax_amount]);

  // Ensure we don't crash if randomData is missing or structure differs
  const justForYouItems = useMemo(() => {
    if (!randomData?.data) return [];
    return randomData.data.map((p) => ({
      id: p.id,
      image: p.main_image || p.image || (p.images && p.images[0]?.url) || "",
      title: p.name,
      link: `/product/${p.slug || p.id}`,
    }));
  }, [randomData]);

  const updateQuantity = (id: number, q: number) => {
    setUpdatingItemId(id);
    updateItem.mutate(
      { id, quantity: q },
      {
        onSettled: () => {
          setUpdatingItemId(null);
        },
      },
    );
  };

  const onRemove = (id: number) => {
    // Optionally track removingItemId too, but request focused on +/-
    removeItem.mutate(id);
  };

  const handleApplyCoupon = (code: string) => {
    applyCoupon.mutate(code);
  };

  const handleRemoveCoupon = () => {
    removeCoupon.mutate();
  };

  if (isLoading) {
    return (
      <div className="bg-[#FFF8EF] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[40px] font-medium text-[#3A0F0E] font-cormorant uppercase tracking-widest mb-10 text-center">
          {t("title")}
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={onRemove}
                  isUpdating={updatingItemId === item.id}
                />
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <OrderSummary
                  totalPieces={items.reduce(
                    (acc, item) => acc + item.quantity,
                    0,
                  )}
                  totalCost={subTotal}
                  discount={totalDiscount}
                  vat={tax}
                  finalTotal={finalTotal}
                  couponCode={cart?.coupon_code || ""}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  isApplyingCoupon={applyCoupon.isPending}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm space-y-6 animate-in zoom-in-95 fade-in duration-700">
            <div className="w-20 h-20 rounded-full bg-[#310E0E]/5 flex items-center justify-center text-[#310E0E]">
              <ShoppingBag size={40} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-medium text-[#3A0F0E] font-cormorant">
                {t("empty.title")}
              </h2>
              <p className="text-[#3A0F0E]/60 max-w-xs mx-auto">
                {t("empty.description")}
              </p>
            </div>
            <Button
              asChild
              className="bg-[#310E0E]! hover:bg-[#310E0E]/90! text-white rounded-full px-12"
            >
              <Link href="/search">{t("empty.button")}</Link>
            </Button>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-14">
          <CollectionCarousel title={t("justForYou")} items={justForYouItems} />
        </div>
      </main>
    </div>
  );
}

"use client";

import { useTranslation } from "@/i18n/hooks";
import { useState, useMemo, useEffect, useRef } from "react";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { OrderNotes } from "@/components/checkout/OrderNotes";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { useCart, useApplyCoupon, useRemoveCoupon } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddresses";
import { useCheckout } from "@/hooks/useCheckout";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { GuestAddressForm } from "@/components/checkout/GuestAddressForm";

export default function CheckoutPage() {
  return (
    <CheckoutContent />
  );
}

function CheckoutContent() {
  const { t } = useTranslation("checkout");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch: refetchCart,
  } = useCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const { data: addressesData, isLoading: isAddressesLoading } = useAddresses();
  const checkoutMutation = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  
  // Guest state
  const [guestData, setGuestData] = useState({
    guest_name: "",
    guest_phone: "",
    guest_address: "",
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState("cod");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [idempotencyKey] = useState(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  });
  const isCheckoutComplete = useRef(false);

  const items = useMemo(
    () => cartData?.data?.items || [],
    [cartData?.data?.items],
  );
  const cart = cartData?.data;
  const addresses = useMemo(() => addressesData?.data || [], [addressesData]);

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
    const shippingCost = parseFloat(cart?.shipping_cost || "0");

    // Final Total Calculation:
    // Selling Total (already discounted by product offers) - Coupon Discount + Tax + Shipping
    const calculatedFinalTotal =
      calculatedSellingTotal - cartDiscountAmount + taxAmount + shippingCost;

    return {
      subTotal: calculatedSubTotal,
      totalDiscount: totalDiscount,
      tax: taxAmount,
      finalTotal: calculatedFinalTotal,
    };
  }, [items, cart?.discount_amount, cart?.tax_amount, cart?.shipping_cost]);

  // Set default address
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddress =
        addresses.find((a) => a.is_default) || addresses[0];
      // Defer update to avoid synchronous setState warning
      setTimeout(() => setSelectedAddressId(defaultAddress.id), 0);
    }
  }, [addresses, selectedAddressId]);

  const handlePayNow = () => {
    if (isAuthenticated) {
      if (!selectedAddressId) {
        toast.error(t("delivery.selectAddressError"));
        return;
      }
    } else {
      // Validate guest fields
      if (!guestData.guest_name.trim() || !guestData.guest_phone.trim() || !guestData.guest_address.trim()) {
        toast.error(t("guest.validationError") || "Please fill all required delivery details.");
        return;
      }
    }

    checkoutMutation.mutate(
      {
        ...(isAuthenticated ? { address_id: selectedAddressId! } : { ...guestData }),
        payment_gateway: selectedPaymentId,
        notes: orderNotes,
        idempotency_key: idempotencyKey,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            // Mark checkout as complete to prevent cart-empty redirect
            isCheckoutComplete.current = true;

            // Save order data to sessionStorage for the success page
            const orderSummary = {
              orderNumber: data.data?.order?.id || data.data?.id || "",
              items: items.map((item) => ({
                id: item.id,
                title:
                  item.product?.name || item.product_variant?.name || "Product",
                price: parseFloat(item.unit_price),
                image:
                  item.product?.main_image ||
                  item.product?.image ||
                  (item.product?.images?.[0]
                    ? typeof item.product.images[0] === "string"
                      ? item.product.images[0]
                      : item.product.images[0]?.url
                    : ""),
                quantity: item.quantity,
              })),
              totalPieces: items.reduce((acc, item) => acc + item.quantity, 0),
              totalCost: subTotal,
              discount: totalDiscount,
              vat: tax,
              finalTotal: finalTotal,
            };
            sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));

            // Check for external payment URL (Paymob)
            const paymentUrl =
              data.data?.payment_url ||
              data.data?.redirect_url ||
              data.data?.url;

            if (paymentUrl) {
              window.location.href = paymentUrl;
            } else {
              router.push("/order-success");
            }
          } else {
            toast.error(data.message || t("failed.message"));
          }
        },
        onError: (error: unknown) => {
          console.error("Checkout error:", error);
          const maybeError = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          const message =
            maybeError.response?.data?.message ||
            maybeError.message ||
            t("failed.message");
          toast.error(message);
        },
      },
    );
  };

  // Redirect to cart if empty (but NOT after a successful checkout)
  useEffect(() => {
    if (!isCartLoading && items.length === 0 && !isCheckoutComplete.current) {
      router.push("/cart");
    }
  }, [isCartLoading, items.length, router]);

  if (isCartLoading || (isAuthenticated && isAddressesLoading) || isAuthLoading) {
    return (
      <div className="bg-[#FFF8EF] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[40px] font-medium text-[#3A0F0E] text-center mb-10 font-cormorant uppercase tracking-widest">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            {isAuthenticated ? (
              <AddressSelector
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            ) : (
              <GuestAddressForm
                value={guestData}
                onChange={setGuestData}
              />
            )}

            <OrderNotes value={orderNotes} onChange={setOrderNotes} />

            <PaymentMethods
              selectedId={selectedPaymentId}
              onSelect={setSelectedPaymentId}
            />
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <CheckoutSummary
                items={items}
                totalPieces={items.reduce(
                  (acc, item) => acc + item.quantity,
                  0,
                )}
                totalCost={subTotal}
                discount={totalDiscount}
                vat={tax}
                shipping={parseFloat(cart?.shipping_cost || "0")}
                finalTotal={finalTotal}
                onPayNow={handlePayNow}
                isSubmitting={checkoutMutation.isPending}
                couponCode={cart?.coupon_code || appliedCouponCode}
                onApplyCoupon={(code) =>
                  applyCouponMutation.mutate(code, {
                    onSuccess: (data) => {
                      console.log("[Coupon Apply Result]", data);
                      if (data?.success) {
                        setAppliedCouponCode(code);
                      }
                    },
                    onSettled: async () => {
                      await queryClient.invalidateQueries({
                        queryKey: ["cart"],
                      });
                      await refetchCart();
                    },
                  })
                }
                onRemoveCoupon={() =>
                  removeCouponMutation.mutate(undefined, {
                    onSuccess: (data) => {
                      console.log("[Coupon Remove Result]", data);
                      if (data?.success !== false) {
                        setAppliedCouponCode("");
                      }
                    },
                    onSettled: async () => {
                      await queryClient.invalidateQueries({
                        queryKey: ["cart"],
                      });
                      await refetchCart();
                    },
                  })
                }
                isApplyingCoupon={
                  applyCouponMutation.isPending ||
                  removeCouponMutation.isPending
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

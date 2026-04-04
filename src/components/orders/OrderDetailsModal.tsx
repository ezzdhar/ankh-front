"use client";

import { useTranslation } from "@/i18n/hooks";
import { Order } from "@/hooks/useOrders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const { t, i18n } = useTranslation("orders");
  const isRTL = i18n.language === "ar";

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl", isRTL && "text-right")}>
            {t("details.title") || "Order Details"} #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className={cn("space-y-6", isRTL ? "text-right" : "text-left")}>
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FCF7F1] rounded-xl">
            <div>
              <p className="text-xs text-slate-500">{t("table.date")}</p>
              <p className="font-medium">
                {format(new Date(order.created_at), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("table.orderStatus")}</p>
              <p className="font-medium text-maroon">
                {t(`status.${order.order_status}`) || order.order_status}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">
                {t("table.paymentStatus")}
              </p>
              <p className="font-medium">
                {t(`status.${order.payment_status}`) || order.payment_status}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">
                {t("checkout:payment.title") || "Payment Method"}
              </p>
              <p className="font-medium uppercase">{order.payment_method}</p>
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div className="space-y-2">
              <h3 className="font-semibold">
                {t("details.shippingAddress") || "Shipping Address"}
              </h3>
              <div className="p-4 border border-slate-100 rounded-xl">
                <p className="text-sm">{order.address.address_details}</p>
                <p className="text-sm text-slate-500">
                  {t("address:postal_code")}: {order.address.postal_code}
                </p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("table.items")}</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-white border border-slate-50 rounded-xl"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {t("details.product") || "Product"} #{item.product_id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {t("cart:quantity")}: {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-maroon">
                    {item.total} {t("common:currency") || "EGP"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                {t("details.subtotal") || "Subtotal"}
              </span>
              <span>
                {order.sub_total} {t("common:currency") || "EGP"}
              </span>
            </div>
            {parseFloat(order.discount_amount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{t("details.discount") || "Discount"}</span>
                <span>
                  -{order.discount_amount} {t("common:currency") || "EGP"}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                {t("details.shipping") || "Shipping"}
              </span>
              <span>
                {order.shipping_cost} {t("common:currency") || "EGP"}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>{t("table.total")}</span>
              <span className="text-maroon">
                {order.total} {t("common:currency") || "EGP"}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-slate-50 rounded-lg text-sm italic">
              <p className="text-slate-500 mb-1 font-bold not-italic">
                {t("checkout:notes.label")}:
              </p>
              {order.notes}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

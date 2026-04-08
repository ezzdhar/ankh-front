import { useState } from "react";
import { useTranslation } from "@/i18n/hooks";
import { Eye, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useOrders, Order } from "@/hooks/useOrders";
import { format } from "date-fns";
import { OrderDetailsModal } from "./OrderDetailsModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function OrdersTable() {
  const { t, i18n } = useTranslation("orders");
  const isRTL = i18n.language === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const filters = {
    search: searchParams.get("search") || undefined,
    order_status: searchParams.get("order_status") || undefined,
    payment_status: searchParams.get("payment_status") || undefined,
  };

  const { data: ordersData, isLoading } = useOrders(page, 10, filters);

  const orders = ordersData?.data?.data || [];
  const totalPages = ordersData?.data?.last_page || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleDownloadPDF = (order: Order) => {
    const doc = new jsPDF();
    const isAR = i18n.language === "ar";

    // Header
    doc.setFontSize(20);
    doc.text(`Order #${order.id}`, 20, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${format(new Date(order.created_at), "PPP")}`, 20, 30);
    doc.text(`Status: ${order.order_status}`, 20, 35);
    doc.text(`Payment: ${order.payment_status}`, 20, 40);

    // Items Table
    const tableData = order.items.map((item) => [
      item.product_id,
      item.quantity,
      item.price,
      item.total,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Product ID", "Quantity", "Price", "Total"]],
      body: tableData,
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${order.sub_total} EGP`, 20, finalY);
    doc.text(`Shipping: ${order.shipping_cost} EGP`, 20, finalY + 5);
    doc.setFontSize(12);
    doc.text(`Total: ${order.total} EGP`, 20, finalY + 12);

    doc.save(`order-${order.id}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-[#3A0F0E]/5 rounded-[20px] border-2 border-dashed border-[#3A0F0E]/20">
        <p className="text-[#3A0F0E]/60">
          {t("noOrders") || "No orders found"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-transparent rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#EBE5E0] hover:bg-transparent">
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium py-4",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.index")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.id")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.date")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.items")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.total")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.paymentStatus")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.orderStatus")}
              </TableHead>
              <TableHead
                className={cn(
                  "text-[#3A0F0E]/50 font-medium",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order.id}
                className="border-b-[#EBE5E0] hover:bg-[#3A0F0E]/5 transition-colors group"
              >
                <TableCell
                  className={cn(
                    "font-medium text-[#3A0F0E] py-5",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium text-[#3A0F0E]",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  #{order.id}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium text-[#3A0F0E]",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  {format(new Date(order.created_at), "yyyy-MM-dd")}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium text-[#3A0F0E]",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  {order.items.length}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-bold text-[#3A0F0E]",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  {order.total} {t("common:currency") || "EGP"}
                </TableCell>

                {/* Payment Status */}
                <TableCell className={cn(isRTL ? "text-right" : "text-left")}>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-4 py-1 font-medium bg-[#5C5C5C] text-white hover:bg-[#5C5C5C]/90",
                      (order.payment_status === "completed" || order.payment_status === "paid") &&
                        "bg-green-600 hover:bg-green-700",
                      order.payment_status === "refunded" &&
                        "bg-orange-600 hover:bg-orange-700",
                      (order.payment_status === "failed" || order.payment_status === "expired") &&
                        "bg-red-600 hover:bg-red-700",
                    )}
                  >
                    {t(`status.${order.payment_status}`) ||
                      order.payment_status}
                  </Badge>
                </TableCell>

                {/* Order Status */}
                <TableCell className={cn(isRTL ? "text-right" : "text-left")}>
                  <Badge
                    className={cn(
                      "rounded-full px-4 py-1 font-medium text-white shadow-none bg-[#5C5C5C]",
                      order.order_status === "processing" &&
                        "bg-[#3B82F6] hover:bg-[#3B82F6]/90",
                      order.order_status === "shipped" &&
                        "bg-indigo-600 hover:bg-indigo-700",
                      (order.order_status === "delivered" || order.order_status === "completed") &&
                        "bg-green-600 hover:bg-green-700",
                      order.order_status === "cancelled" &&
                        "bg-red-600 hover:bg-red-700",
                    )}
                  >
                    {t(`status.${order.order_status}`) || order.order_status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className={cn(isRTL ? "text-right" : "text-left")}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                      className="text-[#3A0F0E] hover:scale-110 transition-transform"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(order)}
                      className="text-[#3A0F0E] hover:scale-110 transition-transform"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="w-10 h-10 rounded-full border border-[#3A0F0E]/20 flex items-center justify-center text-[#3A0F0E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3A0F0E]/5 transition-colors"
          >
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              // Simple pagination logic: show current, first, last, and range
              if (
                p === 1 ||
                p === totalPages ||
                (p >= page - 1 && p <= page + 1)
              ) {
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      "w-10 h-10 rounded-full text-sm font-medium transition-colors",
                      page === p
                        ? "bg-[#3A0F0E] text-white"
                        : "text-[#3A0F0E] hover:bg-[#3A0F0E]/5"
                    )}
                  >
                    {p}
                  </button>
                );
              }
              if (p === page - 2 || p === page + 2) {
                return <span key={p} className="text-[#3A0F0E]/30">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="w-10 h-10 rounded-full border border-[#3A0F0E]/20 flex items-center justify-center text-[#3A0F0E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3A0F0E]/5 transition-colors"
          >
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

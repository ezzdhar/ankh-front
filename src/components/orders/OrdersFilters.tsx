import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function OrdersFilters() {
  const { t, i18n } = useTranslation("orders");
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [orderStatus, setOrderStatus] = useState(searchParams.get("order_status") || "all");
  const [paymentStatus, setPaymentStatus] = useState(
    searchParams.get("payment_status") || "all",
  );

  // Sync local state if URL changes (e.g., browser back button)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setOrderStatus(searchParams.get("order_status") || "all");
    setPaymentStatus(searchParams.get("payment_status") || "all");
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");

    if (orderStatus !== "all") params.set("order_status", orderStatus);
    else params.delete("order_status");

    if (paymentStatus !== "all") params.set("payment_status", paymentStatus);
    else params.delete("payment_status");

    params.set("page", "1"); // Reset to page 1 on search
    router.push(`?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
      {/* Search Field */}
      <div className="w-full md:w-[330px] space-y-2">
        <label className="text-xs text-[#3A0F0E]/50 font-medium">
          {t("filters.search")}
        </label>
        <div className="relative">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("filters.searchPlaceholder")}
            className={cn(
              "bg-transparent border-[#3A0F0E]/75 h-10 rounded-[10px] focus-visible:ring-[#3A0F0E]",
              isRTL ? "pr-10 text-right" : "pl-10 text-left",
            )}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Search
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A0F0E]/75",
              isRTL ? "right-3" : "left-3",
            )}
          />
        </div>
      </div>

      {/* Order Status */}
      <div className="w-full md:w-[240px] space-y-2">
        <label className="text-xs text-[#3A0F0E]/50 font-medium">
          {t("filters.status")}
        </label>
        <Select value={orderStatus} onValueChange={setOrderStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="pending">{t("status.pending")}</SelectItem>
            <SelectItem value="processing">{t("status.processing")}</SelectItem>
            <SelectItem value="shipped">{t("status.shipped")}</SelectItem>
            <SelectItem value="delivered">{t("status.delivered")}</SelectItem>
            <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Status */}
      <div className="w-full md:w-[240px] space-y-2">
        <label className="text-xs text-[#3A0F0E]/50 font-medium">
          {t("filters.paymentStatus")}
        </label>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="pending">{t("status.pending")}</SelectItem>
            <SelectItem value="paid">{t("status.paid")}</SelectItem>
            <SelectItem value="failed">{t("status.failed")}</SelectItem>
            <SelectItem value="refunded">{t("status.refunded")}</SelectItem>
            <SelectItem value="expired">{t("status.expired")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        className="w-full md:w-auto px-10 h-10 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white rounded-full font-medium transition-all"
      >
        {t("filters.apply")}
      </Button>
    </div>
  );
}

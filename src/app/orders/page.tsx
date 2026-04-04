"use client";

import { useTranslation } from "@/i18n/hooks";
import { OrdersFilters, OrdersTable } from "@/components/orders";
import { Suspense } from "react";

export default function MyOrdersPage() {
  return <OrdersContent />;
}

function OrdersContent() {
  const { t } = useTranslation("orders");
  return (
    <div className="min-h-[calc(100vh-64px)] w-full py-10 px-4 md:px-12 lg:px-24 bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-3xl text-[#3A0F0E] text-center mb-10 font-cormorant">
          {t("title")}
        </h1>

        <Suspense
          fallback={
            <div className="h-20 w-full animate-pulse bg-gray-100 rounded-lg" />
          }
        >
          <OrdersFilters />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse bg-gray-100 rounded-lg" />
          }
        >
          <OrdersTable />
        </Suspense>
      </div>
    </div>
  );
}

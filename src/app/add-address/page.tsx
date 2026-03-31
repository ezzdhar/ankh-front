"use client";

import { AddressForm } from "@/components/address";
import { Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AddressPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FFF8EF] py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <Suspense
            fallback={
              <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl" />
            }
          >
            <AddressForm />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}

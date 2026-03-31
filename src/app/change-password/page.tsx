"use client";

import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 md:p-8 bg-[#FFF8EF]">
        <ChangePasswordForm />
      </div>
    </ProtectedRoute>
  );
}

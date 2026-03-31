"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { GuestRoute } from "@/components/auth/GuestRoute";

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <div className="min-h-screen bg-[#FFF8EF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ForgotPasswordForm />
      </div>
    </GuestRoute>
  );
}

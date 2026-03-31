"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { GuestRoute } from "@/components/auth/GuestRoute";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 md:p-8 bg-[#FFF8EF]">
        <RegisterForm />
      </div>
    </GuestRoute>
  );
}

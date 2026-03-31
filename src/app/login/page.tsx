"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { GuestRoute } from "@/components/auth/GuestRoute";

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 md:p-8 bg-[#FFF8EF]">
        <LoginForm />
      </div>
    </GuestRoute>
  );
}

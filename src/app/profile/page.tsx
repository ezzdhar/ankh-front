"use client";

import { ProfileForm } from "@/components/profile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 md:p-8 bg-[#FFF8EF]">
        <ProfileForm />
      </div>
    </ProtectedRoute>
  );
}

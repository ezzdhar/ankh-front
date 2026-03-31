import { Suspense } from "react";
import { OTPForm } from "@/components/auth/OTPForm";

export default function ResetOTPPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 md:p-8 bg-[#FFF8EF]">
      <Suspense
        fallback={
          <div className="animate-pulse bg-gray-100 h-64 w-full rounded-xl" />
        }
      >
        <OTPForm isResetMode={true} />
      </Suspense>
    </div>
  );
}

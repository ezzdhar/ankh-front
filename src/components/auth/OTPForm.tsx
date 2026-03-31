"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/hooks";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyCode, useForgotPassword } from "@/hooks/useAuth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface OTPFormProps {
  isResetMode?: boolean;
}

export function OTPForm({ isResetMode }: OTPFormProps) {
  const { t } = useTranslation("auth");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  // Use prop if provided, otherwise fallback to searchParams
  const mode = isResetMode ? "reset" : searchParams.get("mode") || "register";

  // Verification Hook
  const { mutate: verifyCode, isPending: isLoading } = useVerifyCode();

  // Resend Hook
  const { mutate: resendCode, isPending: isResending } = useForgotPassword();

  // Timer State
  const [timeLeft, setTimeLeft] = useState(60);
  const canResend = timeLeft === 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    if (!canResend) return;
    resendCode(email, {
      onSuccess: () => {
        setTimeLeft(60);
        toast.success(t("otp.resendSuccess"));
      },
      onError: () => {
        // Error handled in hook, but we can add custom logic here if needed
      },
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error(t("otp.invalidCode"));
      return;
    }

    const cleanMode = mode?.trim().toLowerCase();

    verifyCode(
      {
        email,
        verification_code: otp,
        isReset: cleanMode === "reset",
      },
      {
        onSuccess: () => {
          // Redirection logic based on mode
          const cleanMode = mode?.trim().toLowerCase();

          if (cleanMode === "reset") {
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
          } else {
            router.push("/");
          }
        },
      },
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full border border-[#5C2C28] flex items-center justify-center">
            <Lock className="w-10 h-10 text-[#5C2C28]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-[1.75rem] font-bold text-[#3A0F0E] mb-3 font-cormorant leading-tight">
            {t("otp.title")}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base leading-relaxed">
            {t("otp.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-10">
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-12 md:w-14 md:h-14 bg-transparent border-[#8C8C8C]/40 rounded-[12px] text-xl font-medium text-[#3A0F0E] focus-visible:ring-1 focus-visible:ring-[#3A0F0E] border"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-6">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-base font-medium rounded-full shadow-md"
            >
              {t("otp.submit")}
            </Button>

            <div className="text-center">
              <p className="text-[#8C8C8C] text-sm">
                {t("otp.footer.text")}{" "}
                <button
                  type="button"
                  disabled={!canResend || isResending}
                  className={`font-bold text-[#3A0F0E] hover:underline ${!canResend || isResending ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleResend}
                >
                  {canResend
                    ? t("otp.footer.link")
                    : `${t("otp.resendIn")} ${formatTime(timeLeft)}`}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

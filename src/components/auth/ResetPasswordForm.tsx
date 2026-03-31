/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/hooks";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import { useResetPassword } from "@/hooks/useAuth";

const resetPasswordSchema = (t: any) =>
  z
    .object({
      password: z
        .string()
        .min(1, { message: t("validation.passwordRequired") })
        .min(8, { message: t("validation.passwordLength") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.passwordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

type ResetPasswordSchema = z.infer<ReturnType<typeof resetPasswordSchema>>;

export function ResetPasswordForm() {
  const { t, i18n } = useTranslation("auth");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { mutate: resetPassword, isPending: isLoading } = useResetPassword();

  const formSchema = resetPasswordSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPassword({
      email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    });
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full border border-[#5C2C28] flex items-center justify-center">
            <Lock className="w-10 h-10 text-[#5C2C28]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] mb-2 font-cormorant">
            {t("resetPassword.title")}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base">
            {t("resetPassword.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            icon={Lock}
            label={t("resetPassword.newPassword.label")}
            register={register}
            name="password"
            type="password"
            placeholder={t("resetPassword.newPassword.placeholder")}
            error={errors.password}
            isRTL={isRTL}
            required
          />

          <InputField
            icon={Lock}
            label={t("resetPassword.confirmPassword.label")}
            register={register}
            name="confirmPassword"
            type="password"
            placeholder={t("resetPassword.confirmPassword.placeholder")}
            error={errors.confirmPassword}
            isRTL={isRTL}
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-11 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-base font-medium rounded-full"
          >
            {t("resetPassword.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}

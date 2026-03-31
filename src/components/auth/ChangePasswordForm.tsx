/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/i18n/hooks";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InputField from "@/components/ui/InputField";
import { useProfile } from "@/hooks/useProfile";

const changePasswordSchema = (t: any) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: t("validation.currentPasswordRequired") }),
      newPassword: z
        .string()
        .min(1, { message: t("validation.passwordRequired") })
        .min(8, { message: t("validation.passwordLength") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.passwordRequired") }),
      rememberMe: z.boolean().optional(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

type ChangePasswordSchema = z.infer<ReturnType<typeof changePasswordSchema>>;

export function ChangePasswordForm() {
  const { t, i18n } = useTranslation("auth");
  const router = useRouter();
  const { updatePassword } = useProfile();

  const formSchema = changePasswordSchema(t);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: ChangePasswordSchema) => {
    updatePassword.mutate({
      old_password: data.currentPassword,
      password: data.newPassword,
      password_confirmation: data.confirmPassword,
    });
  };

  const isRTL = i18n.language === "ar";
  const isLoading = updatePassword.isPending;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full border border-[#5C2C28] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#5C2C28]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] mb-2 font-cormorant">
            {t("changePassword.title")}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base">
            {t("changePassword.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password Field */}
          <InputField
            icon={Lock}
            label={t("changePassword.currentPassword.label")}
            register={register as any}
            name="currentPassword"
            type="password"
            placeholder={t("changePassword.currentPassword.placeholder")}
            error={errors.currentPassword}
            isRTL={isRTL}
            required
          />

          {/* New Password Field */}
          <div className="space-y-2">
            <InputField
              icon={Lock}
              label={t("changePassword.newPassword.label")}
              register={register as any}
              name="newPassword"
              type="password"
              placeholder={t("changePassword.newPassword.placeholder")}
              error={errors.newPassword}
              isRTL={isRTL}
              required
            />
            <p className="text-[#8C8C8C] text-[10px] md:text-xs">
              {t("changePassword.newPassword.hint")}
            </p>
          </div>

          {/* Confirm Password Field */}
          <InputField
            icon={Lock}
            label={t("changePassword.confirmPassword.label")}
            register={register as any}
            name="confirmPassword"
            type="password"
            placeholder={t("changePassword.confirmPassword.placeholder")}
            error={errors.confirmPassword}
            isRTL={isRTL}
            required
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-[#5C5C5C] leading-none cursor-pointer"
              >
                {t("login.rememberMe")}
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#3A0F0E] hover:underline"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 h-12 bg-[#3A0F0E]! hover:bg-[#2A0B0A]! text-white text-base font-medium rounded-full"
            >
              {t("changePassword.submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 h-12 border border-[#3A0F0E]! bg-transparent hover:bg-[#3A0F0E]/5! text-[#3A0F0E] text-base font-medium rounded-full"
            >
              {t("changePassword.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

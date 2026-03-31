/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/i18n/hooks";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import { useForgotPassword } from "@/hooks/useAuth";

const forgotPasswordSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("validation.emailRequired") })
      .email({ message: t("validation.emailInvalid") }),
  });

type ForgotPasswordSchema = z.infer<ReturnType<typeof forgotPasswordSchema>>;

export function ForgotPasswordForm() {
  const { t, i18n } = useTranslation("auth");
  const { mutate: sendCode, isPending: isLoading } = useForgotPassword();

  const formSchema = forgotPasswordSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    sendCode(data.email);
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full border border-[#5C2C28] flex items-center justify-center">
            <Mail className="w-10 h-10 text-[#5C2C28]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] mb-2 font-cormorant">
            {t("forgotPassword.title")}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base">
            {t("forgotPassword.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            icon={Mail}
            label={t("login.email.label")}
            register={register}
            name="email"
            placeholder={t("login.email.placeholder")}
            error={errors.email}
            isRTL={isRTL}
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-11 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-base font-medium rounded-full"
          >
            {t("forgotPassword.submit")}
          </Button>

          <div className="text-center mt-0">
            <Link
              href="/login"
              className="text-sm font-medium text-[#3A0F0E] hover:underline"
            >
              {t("forgotPassword.backToLogin")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

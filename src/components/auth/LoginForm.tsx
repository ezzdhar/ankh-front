/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/i18n/hooks";
import { Mail, Phone, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import InputField from "@/components/ui/InputField";
import { CustomPhoneInput } from "@/components/ui/CustomPhoneInput";
import { useLogin } from "@/hooks/useAuth";

import * as libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const loginSchema = (t: any, method: "email" | "phone") =>
  z.object({
    identifier: z
      .string()
      .min(1, {
        message:
          method === "email"
            ? t("validation.emailRequired")
            : t("validation.phoneRequired"),
      })
      .transform((val) => {
        if (method === "phone") {
          try {
            const number = phoneUtil.parseAndKeepRawInput(val);
            if (phoneUtil.isValidNumber(number)) {
              return phoneUtil.format(
                number,
                libphonenumber.PhoneNumberFormat.E164,
              );
            }
            return val;
          } catch {
            return val;
          }
        }
        return val;
      })
      .refine(
        (val) => {
          if (method === "email") {
            return z.string().email().safeParse(val).success;
          }
          if (method === "phone") {
            try {
              const number = phoneUtil.parse(val);
              return phoneUtil.isValidNumber(number);
            } catch {
              return false;
            }
          }
          return true;
        },
        {
          message:
            method === "email"
              ? t("validation.emailInvalid")
              : t("validation.phoneInvalid") || "Invalid phone number",
        },
      ),
    password: z
      .string()
      .min(1, { message: t("validation.passwordRequired") })
      .min(8, { message: t("validation.passwordLength") }),
    rememberMe: z.boolean().optional(),
  });

type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;

export function LoginForm() {
  const { t, i18n } = useTranslation("auth");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const { mutate: login, isPending: isLoading } = useLogin();

  const formSchema = loginSchema(t, loginMethod);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    // Determine payload based on method
    const payload: any = {
      password: data.password,
    };

    if (loginMethod === "email") {
      payload.email = data.identifier;
    } else {
      payload.phone = data.identifier; // Already E.164 formatted
    }

    login(payload);
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full border border-[#5C2C28] flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5C2C28"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] mb-2 font-cormorant">
            {t("login.welcome")}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div className="hidden border-b border-[#EBE5E0] mb-8 relative">
          <button
            onClick={() => setLoginMethod("email")}
            className={cn(
              "flex-1 pb-3 text-lg font-medium transition-all relative",
              loginMethod === "email" ? "text-[#3A0F0E]" : "text-[#8C8C8C]",
            )}
          >
            {t("login.tabs.email")}
            {loginMethod === "email" && (
              <span className="absolute bottom-px left-0 w-full h-[2px] bg-[#3A0F0E]" />
            )}
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={cn(
              "flex-1 pb-3 text-lg font-medium transition-all relative",
              loginMethod === "phone" ? "text-[#3A0F0E]" : "text-[#8C8C8C]",
            )}
          >
            {t("login.tabs.phone")}
            {loginMethod === "phone" && (
              <span className="absolute bottom-px left-0 w-full h-[2px] bg-[#3A0F0E]" />
            )}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identifier Field */}
          {loginMethod === "email" ? (
            <InputField
              icon={Mail}
              label={t("login.email.label")}
              register={register}
              name="identifier"
              placeholder={t("login.email.placeholder")}
              error={errors.identifier}
              isRTL={isRTL}
              required
            />
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t("login.phone.label")}
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <CustomPhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("login.phone.placeholder")}
                    defaultCountryCode="EG"
                    allowedCountries={["EG"]}
                    dir={isRTL ? "rtl" : "ltr"}
                    error={!!errors.identifier}
                  />
                )}
              />
              {errors.identifier && (
                <p className="text-xs text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>
          )}

          {/* Password Field */}
          <InputField
            icon={Lock}
            label={t("login.password.label")}
            register={register}
            name="password"
            type="password"
            placeholder={t("login.password.placeholder")}
            error={errors.password}
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
                className="text-sm text-[#5C5C5C] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-11 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-base font-medium rounded-full"
          >
            {t("login.submit")}
          </Button>

          {/* Register Link */}
          <div className="text-center mt-0">
            <p className="text-[#5C5C5C] text-sm">
              {t("login.register.text")}{" "}
              <Link
                href="/register"
                className="font-bold text-[#3A0F0E] hover:underline"
              >
                {t("login.register.link")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/i18n/hooks";
import { Mail, Phone, Lock, User, UserPlus } from "lucide-react";
import Link from "next/link";

import { CustomPhoneInput } from "@/components/ui/CustomPhoneInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InputField from "@/components/ui/InputField";
import MessageError from "@/components/ui/MessageError";
import { useRegister } from "@/hooks/useAuth";

import * as libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const registerSchema = (t: any) =>
  z
    .object({
      fullName: z
        .string()
        .min(1, { message: t("validation.fullNameRequired") }),
      email: z
        .string()
        .min(1, { message: t("validation.emailRequired") })
        .email({ message: t("validation.emailInvalid") }),
      phone: z
        .string()
        .min(1, { message: t("validation.phoneRequired") })
        .transform((val) => {
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
        })
        .refine(
          (val) => {
            try {
              const number = phoneUtil.parse(val);
              return phoneUtil.isValidNumber(number);
            } catch {
              return false;
            }
          },
          { message: t("validation.phoneInvalid") || "Invalid phone number" },
        ),
      password: z
        .string()
        .min(1, { message: t("validation.passwordRequired") })
        .min(8, { message: t("validation.passwordLength") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.passwordRequired") }),
      rememberMe: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

type RegisterSchema = z.infer<ReturnType<typeof registerSchema>>;

export function RegisterForm() {
  const { t, i18n } = useTranslation("auth");
  const { mutate: registerUser, isPending: isLoading } = useRegister();

  const formSchema = registerSchema(t);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    registerUser({
      name: data.fullName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      phone: data.phone, // Already formatted to E.164 by Zod transform
    });
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full border border-[#5C2C28] flex items-center justify-center">
            <div className="relative">
              <UserPlus size={32} stroke="#5C2C28" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] mb-2 font-cormorant">
            {t("register.title")}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base">
            {t("register.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <InputField
            icon={User}
            label={t("register.fullName.label")}
            register={register}
            name="fullName"
            placeholder={t("register.fullName.placeholder")}
            error={errors.fullName}
            isRTL={isRTL}
            required
          />

          {/* Email Field */}
          <InputField
            icon={Mail}
            label={t("register.email.label")}
            register={register}
            name="email"
            placeholder={t("register.email.placeholder")}
            error={errors.email}
            isRTL={isRTL}
            required
          />

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t("register.phone.label")}
              <span className="text-red-500">*</span>
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <CustomPhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t("register.phone.placeholder")}
                  defaultCountryCode="EG"
                  allowedCountries={["EG"]}
                  dir={isRTL ? "rtl" : "ltr"}
                  error={!!errors.phone}
                />
              )}
            />
            {errors.phone && (
              <MessageError message={errors.phone.message ?? ""} />
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <InputField
              icon={Lock}
              label={t("register.password.label")}
              register={register}
              name="password"
              type="password"
              placeholder={t("register.password.placeholder")}
              error={errors.password}
              isRTL={isRTL}
              required
            />
            <p className="text-[#8C8C8C] text-[10px]">
              {t("changePassword.newPassword.hint")}
            </p>
          </div>

          {/* Confirm Password Field */}
          <InputField
            icon={Lock}
            label={t("register.confirmPassword.label")}
            register={register}
            name="confirmPassword"
            type="password"
            placeholder={t("register.confirmPassword.placeholder")}
            error={errors.confirmPassword}
            isRTL={isRTL}
            required
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between py-1">
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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-11 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-base font-medium rounded-full"
          >
            {t("register.submit")}
          </Button>

          {/* Login Link */}
          <div className="text-center mt-2">
            <p className="text-[#5C5C5C] text-sm">
              {t("register.footer.text")}{" "}
              <Link
                href="/login"
                className="font-bold text-[#3A0F0E] hover:underline"
              >
                {t("register.footer.link")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

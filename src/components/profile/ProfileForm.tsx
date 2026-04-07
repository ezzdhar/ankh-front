/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/i18n/hooks";
import { Mail, Phone, User, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomPhoneInput } from "@/components/ui/CustomPhoneInput";

import { Button } from "@/components/ui/button";
import MessageError from "@/components/ui/MessageError";
import InputField from "@/components/ui/InputField";
import { useProfile } from "@/hooks/useProfile";

const profileSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, { message: t("validation.fullNameRequired") }),
    email: z.string().optional(), // Read-only typically
    phone: z.string().min(1, { message: t("validation.phoneRequired") }),
    // image is handled separately as File
  });

type ProfileSchema = z.infer<ReturnType<typeof profileSchema>>;

export function ProfileForm() {
  const { t, i18n } = useTranslation("profile");
  const router = useRouter();
  const { getProfile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Derived state
  const user = getProfile.data?.data;
  const isLoading = updateProfile.isPending || getProfile.isLoading;

  const formSchema = profileSchema(t);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || "",
    },
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
    },
  });

  // Sync image only when it changes from backend
  // useEffect(() => {
  //   if (user?.image) {
  //     setSelectedImage(user.image);
  //   }
  // }, [user?.image]);

  // Loading State
  if (getProfile.isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#3A0F0E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#3A0F0E] font-medium animate-pulse">
            {t("loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (getProfile.isError) {
    return (
      <div className="w-full h-96 flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center max-w-md">
          <p className="font-bold mb-2">Error Loading Profile</p>
          <p className="text-sm opacity-80 mb-4">
            {(getProfile.error as any)?.message || "Something went wrong"}
          </p>
          <Button
            onClick={() => getProfile.refetch()}
            variant="outline"
            className="bg-white border-red-200 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileSchema) => {
    updateProfile.mutate({
      name: data.name,
      phone: data.phone,
      phone_key: "+20", // You might want to extract this from the phone input component if possible, or assume +20 for now as per user request example
      image: imageFile || undefined,
    });
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFF8EF] rounded-[20px] p-8 shadow-sm border border-[#EBE5E0]">
        {/* Header with Avatar */}
        <div className="text-center mb-8">
          <div
            className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#5C2C28] relative">
              <Image
                src={
                  selectedImage ||
                  user?.image ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
                }
                alt="Profile"
                fill
                className="rounded-full object-cover"
                unoptimized // If dealing with external or local blob URLs
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="text-white w-6 h-6" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] mb-1 font-cormorant">
            {getProfile.data?.data?.name || "User"}
          </h1>
          <p className="text-[#8C8C8C] text-sm md:text-base">{t("title")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field (Read Only) */}
          <InputField
            icon={Mail}
            label={t("email.label")}
            register={register}
            name="email"
            placeholder={t("email.placeholder")}
            error={errors.email}
            isRTL={isRTL}
            disabled
            className="opacity-70"
          />

          {/* Full Name Field */}
          <InputField
            icon={User}
            label={t("fullName.label")}
            register={register}
            name="name"
            placeholder={t("fullName.placeholder")}
            error={errors.name}
            isRTL={isRTL}
            required
          />

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t("phone.label")}
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
                  placeholder={t("phone.placeholder")}
                  defaultCountryCode="EG"
                  dir={isRTL ? "rtl" : "ltr"}
                  error={!!errors.phone}
                />
              )}
            />
            {errors.phone && (
              <MessageError message={errors.phone.message ?? ""} />
            )}

            <div className="pt-1 px-1">
              <p className="text-xs text-[#8C8C8C]">
                {t("changePassword.question")}{" "}
                <Link
                  href="/change-password"
                  className="text-[#3A0F0E] font-semibold hover:underline"
                >
                  {t("changePassword.link")}
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 h-11 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-sm font-medium rounded-full shadow-sm"
            >
              {t("submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 h-11 border! border-[#5C2C28]! bg-transparent hover:bg-white! text-[#5C2C28] text-sm font-medium rounded-full"
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

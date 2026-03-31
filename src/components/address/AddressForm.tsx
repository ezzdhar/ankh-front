import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/i18n/hooks";
import {
  useAddresses,
  useCities,
  useCreateAddress,
  useUpdateAddress,
  type City,
} from "@/hooks/useAddress";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MapPin, AlignLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MessageError from "@/components/ui/MessageError";
import { cn } from "@/lib/utils";

const addressSchema = (t: (key: string) => string) =>
  z.object({
    city_id: z.string().min(1, { message: t("validation.cityRequired") }),
    address_details: z
      .string()
      .min(1, { message: t("validation.streetRequired") }),
    postal_code: z.string().optional().or(z.literal("")),
    is_default: z.boolean(),
  });

type AddressSchema = z.infer<ReturnType<typeof addressSchema>>;

export function AddressForm() {
  const { t, i18n } = useTranslation("address");
  const searchParams = useSearchParams();
  const router = useRouter();
  const addressId = searchParams.get("id");
  const isEdit = !!addressId;

  const { data: citiesData, isLoading: isLoadingCities } = useCities();
  const { data: addressesData, isLoading: isLoadingAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress(addressId!);

  // Find current address from the list
  const currentAddress = useMemo(() => {
    if (!isEdit || !addressesData?.data) return null;
    return addressesData.data.find((a) => a.id.toString() === addressId);
  }, [isEdit, addressesData, addressId]);

  const formSchema = addressSchema(t);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city_id: "",
      address_details: "",
      postal_code: "",
      is_default: false,
    },
  });

  const isRTL = i18n.language === "ar";
  const cities = citiesData?.data || [];
  const isInitialLoading = isLoadingCities || (isEdit && isLoadingAddresses);
  const isSubmitting = createAddress.isPending || updateAddress.isPending;

  // Prefill form when editing
  useEffect(() => {
    if (isEdit && currentAddress && cities.length > 0) {
      const vals = {
        city_id: currentAddress.city_id.toString(),
        address_details: currentAddress.address_details,
        postal_code: currentAddress.postal_code || "",
        is_default: currentAddress.is_default,
      };
      reset(vals);
      // Double check the value is set
      setValue("city_id", vals.city_id);
    }
  }, [isEdit, currentAddress, reset, setValue, cities.length]);

  const onSubmit = async (data: AddressSchema) => {
    if (isEdit) {
      updateAddress.mutate(
        {
          city_id: Number(data.city_id),
          address_details: data.address_details,
          postal_code: data.postal_code || "",
          is_default: data.is_default,
        },
        {
          onSuccess: () => router.push("/addresses"),
        },
      );
    } else {
      createAddress.mutate(
        {
          city_id: data.city_id,
          address_details: data.address_details,
          postal_code: data.postal_code || "",
          is_default: data.is_default ? 1 : 0,
        },
        {
          onSuccess: () => router.push("/addresses"),
        },
      );
    }
  };

  if (isInitialLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A0F0E]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#3A0F0E] text-center mb-8 font-cormorant">
        {t("title")}
      </h1>

      {/* Card Container */}
      <div className="bg-[#FFF8EF] rounded-[20px] p-6 md:p-8 border border-[#EBE5E0] shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* City Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3A0F0E]" />
              {t("city.label")}*
            </label>
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value || "loading"}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full h-11 border-[#8C8C8C]/50 rounded-[10px] text-sm bg-transparent focus:ring-[#3A0F0E]",
                      isRTL ? "flex-row-reverse" : "",
                    )}
                  >
                    <SelectValue placeholder={t("city.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city: City) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city_id && (
              <MessageError message={errors.city_id.message ?? ""} />
            )}
          </div>

          {/* Address Details Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-[#3A0F0E]" />
              {t("details.label")} *
            </label>
            <Controller
              name="address_details"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value as string}
                  placeholder={t("details.placeholder")}
                  className="min-h-[100px] border-[#8C8C8C]/50 rounded-[10px] text-sm bg-transparent resize-none p-3 focus-visible:ring-[#3A0F0E] focus-visible:border-[#3A0F0E]"
                  dir={isRTL ? "rtl" : "ltr"}
                />
              )}
            />
            {errors.address_details && (
              <MessageError message={errors.address_details.message ?? ""} />
            )}
          </div>

          {/* Postal Code Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3A0F0E]" />
              {t("postalCode.label")}
            </label>
            <Controller
              name="postal_code"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value as string}
                  placeholder={t("postalCode.placeholder")}
                  className="min-h-[100px] border-[#8C8C8C]/50 rounded-[10px] text-sm bg-transparent resize-none p-3 focus-visible:ring-[#3A0F0E] focus-visible:border-[#3A0F0E]"
                  dir={isRTL ? "rtl" : "ltr"}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="is_default"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 text-[#3A0F0E] border-gray-300 rounded focus:ring-[#3A0F0E]"
                />
              )}
            />
            <label className="text-sm font-medium text-[#3A0F0E]">
              {t("list.default")}
            </label>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full md:w-auto px-12 h-11 bg-[#3A0F0E]! hover:bg-[#5C2C28]! text-white text-sm font-medium rounded-full shadow-md transition-all active:scale-95"
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

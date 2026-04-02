"use client";

import { useTranslation } from "@/i18n/hooks";
import { MapPin } from "lucide-react";

export interface GuestData {
  guest_name: string;
  guest_phone: string;
  guest_address: string;
}

interface GuestAddressFormProps {
  value: GuestData;
  onChange: (data: GuestData) => void;
}

export function GuestAddressForm({ value, onChange }: GuestAddressFormProps) {
  const { t } = useTranslation("checkout");

  const handleChange = (field: keyof GuestData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const inputClass =
    "w-full px-4 py-3 bg-white/70 border border-[#3A0F0E]/15 rounded-lg text-sm text-[#3A0F0E] placeholder:text-[#3A0F0E]/40 focus:outline-none focus:ring-1 focus:ring-[#3A0F0E] transition-all";

  return (
    <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#3A0F0E] mb-4">
        <MapPin size={20} />
        <h2 className="text-lg font-medium">{t("delivery.title")}</h2>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#3A0F0E]/70 uppercase tracking-wide">
            {t("guest.name")}
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder={t("guest.namePlaceholder")}
            value={value.guest_name}
            onChange={(e) => handleChange("guest_name", e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#3A0F0E]/70 uppercase tracking-wide">
            {t("guest.phone")}
          </label>
          <input
            type="tel"
            className={inputClass}
            placeholder={t("guest.phonePlaceholder")}
            value={value.guest_phone}
            onChange={(e) => handleChange("guest_phone", e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#3A0F0E]/70 uppercase tracking-wide">
            {t("guest.address")}
          </label>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder={t("guest.addressPlaceholder")}
            value={value.guest_address}
            onChange={(e) => handleChange("guest_address", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

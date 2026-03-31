"use client";

import { useTranslation } from "@/i18n/hooks";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Address } from "@/hooks/useAddresses";

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
}: AddressSelectorProps) {
  const { t } = useTranslation("checkout");

  return (
    <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#3A0F0E] mb-4">
        <MapPin size={20} />
        <h2 className="text-lg font-medium">{t("delivery.title")}</h2>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all bg-white/50",
              selectedId === address.id
                ? "border-[#3A0F0E] shadow-sm"
                : "border-[#3A0F0E]/10 hover:border-[#3A0F0E]/30",
            )}
          >
            <div className="relative flex items-center justify-center shrink-0">
              <input
                type="radio"
                name="address"
                className="sr-only"
                checked={selectedId === address.id}
                onChange={() => onSelect(address.id)}
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border border-[#3A0F0E] flex items-center justify-center transition-all",
                  selectedId === address.id
                    ? "border-[6px] border-[#3A0F0E] bg-white" // Donut style
                    : "opacity-40",
                )}
              />
            </div>
            <span className="text-[#3A0F0E] font-medium text-base">
              {address.city}
            </span>
          </label>
        ))}
      </div>

      <Link
        href="/add-address"
        className="inline-flex items-center gap-2 text-sm text-[#3A0F0E] hover:opacity-70 transition-opacity mt-2"
      >
        <Plus size={16} />
        {t("delivery.addNew")}
      </Link>
    </div>
  );
}

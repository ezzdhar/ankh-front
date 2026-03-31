"use client";

import { useTranslation } from "@/i18n/hooks";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Edit2, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Address } from "@/hooks/useAddress";

interface AddressCardProps {
  address: Address;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const { t, i18n } = useTranslation("address");
  const isRTL = i18n.language === "ar";

  return (
    <div className="bg-[#FFF8EF] rounded-[15px] border border-[#EBE5E0] p-6 shadow-sm flex flex-col h-full transition-all hover:shadow-md">
      {/* Header: Governorate + Default Badge */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-[#3A0F0E]" />
          <h3 className="text-xl font-bold text-[#3A0F0E] font-cormorant">
            {address.city_name}
          </h3>
        </div>
        {address.is_default && (
          <Badge
            variant="secondary"
            className="bg-[#3A0F0E] text-white hover:bg-[#3A0F0E]/90"
          >
            {t("list.default")}
          </Badge>
        )}
      </div>

      <div className="flex-1 space-y-4">
        {/* Address Details */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[#3A0F0E] mt-1 shrink-0" />
          <p className="text-sm text-[#3A0F0E]/80">{address.address_details}</p>
        </div>

        {/* Postal Code */}
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-[#3A0F0E] shrink-0" />
          <p className="text-sm text-[#3A0F0E]/80">
            {t("postalCode.label")}: {address.postal_code}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#EBE5E0] my-4" />

      {/* Actions */}
      <div
        className={cn(
          "flex items-center gap-6",
          isRTL ? "flex-row-reverse" : "",
        )}
      >
        <button
          onClick={() => onEdit?.(address.id)}
          className="flex items-center gap-2 text-[#3A0F0E] hover:text-[#5C2C28] text-sm font-medium transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {t("list.edit")}
        </button>
        <button
          onClick={() => onDelete?.(address.id)}
          className="flex items-center gap-2 text-[#C85D5D] hover:text-[#A64444] text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {t("list.delete")}
        </button>
      </div>
    </div>
  );
}

export function AddNewAddressCard() {
  const { t } = useTranslation("address");

  return (
    <Link href="/add-address" className="block h-full group">
      <div className="h-full min-h-[200px] rounded-[15px] border-2 border-dashed border-[#3A0F0E]/20 bg-[#FFF8EF]/50 flex flex-col items-center justify-center gap-4 transition-all hover:border-[#3A0F0E]/40 hover:bg-[#FFF8EF]">
        <div className="w-12 h-12 rounded-full border border-[#3A0F0E]/30 flex items-center justify-center text-[#3A0F0E] transition-colors group-hover:bg-[#3A0F0E]/5">
          <Plus className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-[#3A0F0E] font-cormorant">
            {t("list.addNew.title")}
          </h3>
          <p className="text-sm text-[#3A0F0E]/60 max-w-[200px]">
            {t("list.addNew.subtitle")}
          </p>
        </div>
      </div>
    </Link>
  );
}

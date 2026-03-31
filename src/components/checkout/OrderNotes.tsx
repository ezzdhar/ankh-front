"use client";

import { useTranslation } from "@/i18n/hooks";
import { AlignLeft } from "lucide-react";

interface OrderNotesProps {
  value: string;
  onChange: (val: string) => void;
}

export function OrderNotes({ value, onChange }: OrderNotesProps) {
  const { t } = useTranslation("checkout");

  return (
    <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#3A0F0E] mb-4">
        <AlignLeft size={20} />
        <h2 className="text-lg font-medium">{t("notes.title")}</h2>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("notes.placeholder")}
        className="w-full h-32 p-4 bg-transparent border border-[#3A0F0E]/20 rounded-sm focus:outline-none focus:border-[#3A0F0E] transition-colors resize-none placeholder:text-[#3A0F0E]/30 text-sm"
      />
    </div>
  );
}

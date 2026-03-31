"use client";

import { useTranslation } from "@/i18n/hooks";
import { CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PaymentMethodsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PaymentMethods({ selectedId, onSelect }: PaymentMethodsProps) {
  const { t } = useTranslation("checkout");

  const methods: PaymentMethod[] = [
    {
      id: "cod",
      label: t("payment.cod"),
      icon: <Wallet size={20} />,
    },
    {
      id: "paymob",
      label: t("payment.paymob"),
      icon: <CreditCard size={20} />,
    },
  ];

  return (
    <div className="bg-[#FCF7F1]/50 border border-[#3A0F0E]/10 rounded-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#3A0F0E] mb-4">
        <CreditCard size={20} />
        <h2 className="text-lg font-medium">{t("payment.title")}</h2>
      </div>

      <div className="space-y-3">
        {methods.map((method) => (
          <label
            key={method.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all bg-white/50",
              selectedId === method.id
                ? "border-[#3A0F0E] shadow-sm"
                : "border-[#3A0F0E]/10 hover:border-[#3A0F0E]/30",
            )}
          >
            <div className="relative flex items-center justify-center shrink-0">
              <input
                type="radio"
                name="payment"
                className="sr-only"
                checked={selectedId === method.id}
                onChange={() => onSelect(method.id)}
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border border-[#3A0F0E] flex items-center justify-center transition-all",
                  selectedId === method.id
                    ? "border-[6px] border-[#3A0F0E] bg-white" // Donut style
                    : "opacity-40",
                )}
              />
            </div>
            <div className="flex items-center gap-3 text-[#3A0F0E]">
              {method.icon}
              <span className="font-medium text-sm md:text-base">
                {method.label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

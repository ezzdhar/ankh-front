/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageError from "./MessageError";
import { cn } from "@/lib/utils";

interface IProps {
  icon: LucideIcon;
  label: string;
  register: any;
  name: string;
  placeholder: string;
  type?: string;
  error?: { message?: string };
  isRTL: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const InputField = ({
  icon: Icon,
  label,
  register,
  name,
  placeholder,
  type = "text",
  error,
  isRTL,
  required = true,
  disabled = false,
  className,
}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#3A0F0E] flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Input
          {...register(name)}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "bg-transparent border-[#8C8C8C]/50 h-11 focus-visible:ring-[#3A0F0E] px-4",
            isRTL ? "text-right" : "text-left",
            isPassword && (isRTL ? "pl-10" : "pr-10"),
            className,
          )}
          dir={isRTL ? "rtl" : "ltr"}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-[#8C8C8C] hover:text-[#3A0F0E] transition-colors",
              isRTL ? "left-3" : "right-3",
            )}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <MessageError message={error?.message ?? ""} />}
    </div>
  );
};
export default InputField;

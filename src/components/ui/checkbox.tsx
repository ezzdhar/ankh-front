"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-[#8C8C8C] shrink-0 rounded-[4px] border shadow-xs transition-all outline-none focus-visible:ring-1 focus-visible:ring-[#3A0F0E] disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[#3A0F0E] data-[state=checked]:border-[#3A0F0E] data-[state=checked]:text-white",
        "size-4",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

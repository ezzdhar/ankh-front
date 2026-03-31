import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[100px] w-full rounded-[10px] border border-[#3A0F0E]/30 bg-transparent px-4 py-3 text-sm shadow-sm transition-all placeholder:text-[#3A0F0E]/40 focus-visible:outline-none focus-visible:border-[#3A0F0E] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

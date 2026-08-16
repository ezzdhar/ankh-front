"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoaderProps {
  fullScreen?: boolean;
  minHeight?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loader({
  fullScreen = false,
  minHeight,
  size = "md",
  text,
  className,
}: LoaderProps) {
  const sizeConfig = {
    sm: {
      ring: "w-8 h-8 border-2",
      logo: "w-12 h-4",
      text: "text-xs",
    },
    md: {
      ring: "w-14 h-14 border-[2.5px]",
      logo: "w-20 h-6",
      text: "text-sm",
    },
    lg: {
      ring: "w-20 h-20 border-[3px]",
      logo: "w-28 h-8",
      text: "text-base",
    },
  }[size];

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4 select-none", className)}>
      <div className="relative flex items-center justify-center">
        {/* Animated Outer Spinner Ring with Maroon & Gold Accent */}
        <div
          className={cn(
            "rounded-full border-[#3A0F0E]/15 border-t-[#3A0F0E] border-r-[#C6943E] animate-spin",
            sizeConfig.ring,
          )}
          style={{ animationDuration: "0.9s" }}
        />

        {/* Pulsing Central ANKH Emblem Accent */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#C6943E] animate-ping opacity-60" />
        </div>
      </div>

      {/* Brand Logo with Gentle Pulse Shimmer */}
      <div className="flex flex-col items-center gap-1.5 animate-pulse">
        <div className={cn("relative", sizeConfig.logo)}>
          <Image
            src="/logo.svg"
            alt="ANKH"
            fill
            className="object-contain"
            priority
          />
        </div>
        {text && (
          <span
            className={cn(
              "font-medium text-[#3A0F0E]/70 font-primary tracking-wide",
              sizeConfig.text,
            )}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF8EF]/95 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center bg-[#FFF8EF]",
        minHeight || "min-h-[50vh]",
      )}
    >
      {content}
    </div>
  );
}

export default Loader;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { ReactNode } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface SliderProps {
  children: ReactNode[];
  className?: string;
  slidesPerView?: number;
  autoplay?: boolean | { delay: number; disableOnInteraction: boolean };
  loop?: boolean;
  effect?: "slide" | "fade";
  navigation?: boolean;
  pagination?: boolean;
  onSwiper?: (swiper: any) => void;
}

export function Slider({
  children,
  className = "",
  slidesPerView = 1,
  autoplay = false,
  loop = true,
  effect = "slide",
  navigation = false,
  pagination = false,
  onSwiper,
}: SliderProps) {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, EffectFade]}
      spaceBetween={0}
      slidesPerView={slidesPerView}
      autoplay={autoplay}
      loop={loop}
      effect={effect}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      onSwiper={onSwiper}
      className={`w-full h-full ${className}`}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index} className="w-full h-full">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// Re-export SwiperSlide to be used if needed directly, though our wrapper handles arrays of children
export { SwiperSlide };

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Share2,
  Heart,
  Minus,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useToggleFavorite } from "@/hooks/useFavorite";
import { toast } from "sonner";

export function ProductInfo({ product }: { product: Product }) {
  const { t } = useTranslation("product");
  const isMounted = useIsMounted();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingAction, setLoadingAction] = useState<"cart" | "buy_now" | null>(null);
  const addToCart = useAddToCart();
  const toggleFavorite = useToggleFavorite();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("share.copied", { lng: isMounted ? undefined : "en" }) || "Link copied to clipboard!");
  };

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(product.id);
  };

  // Extract variants
  const variants = useMemo(() => product.variants || [], [product.variants]);
  const showVariants = variants.length > 1;

  // Track which variant card is selected by ID
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  // Auto-select the default variant (or first) on mount
  useEffect(() => {
    if (variants.length === 0) return;
    const def = variants.find((v) => v.is_default) || variants[0];
    setSelectedVariantId(def.id);
  }, [variants]);

  // Derive the selected variant object
  const selectedVariant = useMemo(() => {
    if (!selectedVariantId) {
      return variants.find((v) => v.is_default) || variants[0] || null;
    }
    return variants.find((v) => v.id === selectedVariantId) || null;
  }, [variants, selectedVariantId]);

  // Helpers for display
  const LOW_STOCK_THRESHOLD = 10;

  const [quantity, setQuantity] = useState(1);

  // Filter out any invalid image URLs
  const images = useMemo(() => {
    let allImages = [];
    if (product.main_image) allImages.push(product.main_image);
    if (product.images?.length) {
      allImages = [...allImages, ...product.images.map((img) => img.url)];
    }
    // Add selected variant image if it exists and is not already in the list
    if (selectedVariant?.image) {
      const variantImageUrl = selectedVariant.image.startsWith("http")
        ? selectedVariant.image
        : `https://admin.ankh-eg.com/storage/${selectedVariant.image}`;
      if (!allImages.includes(variantImageUrl)) {
        allImages.unshift(variantImageUrl);
      }
    }
    return [...new Set(allImages)].filter(Boolean);
  }, [product.main_image, product.images, selectedVariant]);

  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);
  const [thumbViewportRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedImage(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedImage]);

  useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const getCartPayload = () => {
    if (showVariants && !selectedVariant) {
      toast.error(t("details.selectVariant", { lng: isMounted ? undefined : "en" }) || "Please select options");
      return null;
    }

    return {
      product_id: product.id,
      product_variant_id: selectedVariant?.id,
      quantity,
    };
  };

  const handleAddToCart = () => {
    const payload = getCartPayload();
    if (!payload) {
      return;
    }

    addToCart.mutate(payload);
  };

  const handleCheckout = () => {
    const payload = getCartPayload();
    if (!payload) {
      return;
    }

    addToCart.mutate(payload, {
      onSuccess: (data) => {
        if ((data as { success?: boolean })?.success) {
          router.push("/checkout");
        }
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 bg-[#FFF8EF]">
      {/* Gallery Section */}
      <div className="flex flex-col gap-4 w-full max-w-[420px] sm:max-w-[520px] lg:w-[560px] lg:max-w-[560px] mx-auto lg:mx-0 select-none animate-in fade-in slide-in-from-left-8 duration-700">
        {/* Main Slider */}
        <div className="relative group">
          <div className="overflow-hidden rounded-md" ref={mainViewportRef}>
            <div className="flex">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative flex-[0_0_100%] min-w-0 aspect-[4/5] sm:aspect-3/4"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 60vw, 560px"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaMainApi?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#3A0F0E] opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => emblaMainApi?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#3A0F0E] opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Thumbnail Slider */}
        <div className="relative">
          <div className="overflow-hidden" ref={thumbViewportRef}>
            <div className="flex gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onThumbClick(idx)}
                  className={cn(
                    "relative shrink-0 w-16 h-24 sm:w-20 sm:h-28 overflow-hidden transition-all duration-300",
                    selectedImage === idx
                      ? "opacity-100 ring-1 ring-[#3A0F0E]"
                      : "opacity-100",
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${idx}`}
                    fill
                    className="object-cover"
                  />
                  {selectedImage !== idx && (
                    <div className="absolute inset-0 bg-black/30 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="flex justify-start gap-3">
          <button
            onClick={handleToggleFavorite}
            className="w-10 h-10 rounded-full bg-transparent shadow-sm flex items-center justify-center text-[#3A0F0E] hover:bg-gray-50 transition-colors"
          >
            <Heart
              size={18}
              className={cn(
                toggleFavorite.isPending && "opacity-50",
                product.is_favorited && "fill-current",
              )}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-transparent shadow-sm flex items-center justify-center text-[#3A0F0E] hover:bg-gray-50 transition-colors"
          >
            <Share2 size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-medium text-[#3A0F0E] font-cormorant leading-tight">
            {product.name}
          </h1>

          {/* Rating Display */}
          {product.average_rating !== undefined && Number(product.average_rating) > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const rating = Number(product.average_rating);
                  const isFilled = i < Math.round(rating);
                  return (
                    <Star
                      key={i}
                      size={16}
                      fill={isFilled ? "currentColor" : "none"}
                      className={isFilled ? "text-yellow-400" : "text-gray-300"}
                    />
                  );
                })}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {Number(product.average_rating).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviews_count || 0} {t("details.reviews")})
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="text-xl font-bold text-[#3A0F0E]">
              {(() => {
                const isZeroDiscount =
                  product.discount_percentage === "0.00" ||
                  product.discount_percentage === "0" ||
                  product.discount_percentage === 0;
                
                return selectedVariant?.price ||
                  (!isZeroDiscount && product.price_after_discount) ||
                  product.price;
              })()}{" "}
              EGP
            </div>
            {(() => {
              const isZeroDiscount =
                product.discount_percentage === "0.00" ||
                product.discount_percentage === "0" ||
                product.discount_percentage === 0;

              const displayPrice =
                selectedVariant?.price || (!isZeroDiscount && product.price_after_discount) || null;
              const originalPrice = product.price;
              
              if (!isZeroDiscount && displayPrice && String(displayPrice) !== String(originalPrice)) {
                return (
                  <div className="text-lg text-gray-400 line-through">
                    {originalPrice} EGP
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

        <div className="space-y-2 text-[#3A0F0E]">
          {product.sku && (
            <div className="flex gap-2 text-base">
              <span className="font-medium">{t("details.sku", { lng: isMounted ? undefined : "en" })} :</span>
              <span className="opacity-70">{product.sku}</span>
            </div>
          )}
          {product.category_name && (
            <div className="flex gap-2 text-base">
              <span className="font-medium">{t("details.category", { lng: isMounted ? undefined : "en" })} :</span>
              <span className="opacity-70 uppercase tracking-widest">
                {product.category_name}
              </span>
            </div>
          )}
        </div>

        {/* Variant Cards */}
        {showVariants && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-[#3A0F0E]">
              {t("details.chooseOption", { lng: isMounted ? undefined : "en" })}
            </div>
            <div className="grid grid-cols-2 min-[400px]:grid-cols-3 gap-3">
              {variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                const isOutOfStock = variant.stock <= 0;
                const isLowStock =
                  variant.stock > 0 && variant.stock <= LOW_STOCK_THRESHOLD;

                return (
                  <button
                    key={variant.id}
                    onClick={() =>
                      !isOutOfStock && setSelectedVariantId(variant.id)
                    }
                    disabled={isOutOfStock}
                    className={cn(
                      "relative w-full text-start p-4 rounded-lg border-2 transition-all duration-200",
                      isSelected
                        ? "border-[#C6943E] bg-[#FFFDF7] shadow-sm"
                        : "border-[#3A0F0E]/10 bg-white hover:border-[#3A0F0E]/30",
                      isOutOfStock &&
                        "opacity-50 cursor-not-allowed bg-gray-50",
                    )}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 end-3 w-5 h-5 rounded-full bg-[#C6943E] flex items-center justify-center">
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}

                    {/* Attribute Lines */}
                    <div className="space-y-1 pe-6">
                      {variant.attribute_values &&
                      variant.attribute_values.length > 0 ? (
                        variant.attribute_values.map((attr) => (
                          <div
                            key={attr.id}
                            className="flex items-center gap-2 text-sm text-[#3A0F0E]"
                          >
                            <span className="font-medium">
                              {attr.attribute.name}:
                            </span>
                            {attr.color_code && (
                              <span
                                className="inline-block w-4 h-4 rounded-full border border-black/10"
                                style={{ backgroundColor: attr.color_code }}
                              />
                            )}
                            <span className="opacity-80">{attr.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-[#3A0F0E] opacity-70">
                          {variant.is_default
                            ? "Default"
                            : `Variant #${variant.id}`}
                        </div>
                      )}
                    </div>

                    {/* Stock Badge */}
                    {isOutOfStock && (
                      <div className="mt-2 text-xs font-medium text-red-600">
                        {t("details.outOfStock", { lng: isMounted ? undefined : "en" })}
                      </div>
                    )}
                    {isLowStock && (
                      <div className="mt-2 text-xs font-medium text-[#C6943E]">
                        {t("details.lowStock", { count: variant.stock, lng: isMounted ? undefined : "en" })}
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-2 text-base font-bold text-[#3A0F0E]">
                      {parseFloat(variant.price).toFixed(2)} EGP
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Total & Quantity & Buttons */}
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-base text-[#3A0F0E]">
              {t("details.total")} :
            </span>
            <span className="text-lg font-bold text-[#3A0F0E]">
              {(
                parseFloat(
                  selectedVariant?.price ||
                    product.price_after_discount ||
                    product.price,
                ) * quantity
              ).toFixed(2)}{" "}
              EGP
            </span>
          </div>

          <div className="flex items-center justify-between border border-[#3A0F0E] rounded-full h-12 px-6">
            <button
              onClick={() => setQuantity((q: number) => Math.max(1, q - 1))}
              className="text-[#3A0F0E] hover:opacity-70 transition-opacity"
            >
              <Minus size={20} />
            </button>
            <span className="text-[#3A0F0E] font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q: number) => q + 1)}
              className="text-[#3A0F0E] hover:opacity-70 transition-opacity"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              disabled={addToCart.isPending}
              onClick={() => {
                setLoadingAction("cart");
                handleAddToCart();
              }}
              className="flex-1 h-12 border-2 border-[#3A0F0E] text-[#3A0F0E] text-sm font-medium rounded-full hover:bg-[#3A0F0E] hover:text-white transition-all uppercase tracking-wider"
            >
              {addToCart.isPending && loadingAction === "cart"
                ? t("details.adding", { lng: isMounted ? undefined : "en" })
                : t("details.addToCart", { lng: isMounted ? undefined : "en" })}
            </Button>

            <Button
              disabled={addToCart.isPending}
              onClick={() => {
                setLoadingAction("buy_now");
                const payload = getCartPayload();
                if (!payload) return;
                addToCart.mutate(payload, {
                  onSuccess: () => {
                    router.push("/cart");
                  }
                });
              }}
              className="flex-1 h-12 bg-[#3A0F0E] text-white hover:bg-[#3A0F0E]/90 text-sm font-medium rounded-full transition-all uppercase tracking-wider"
            >
              {addToCart.isPending && loadingAction === "buy_now"
                ? t("details.adding", { lng: isMounted ? undefined : "en" })
                : t("details.buyNow", { lng: isMounted ? undefined : "en" })}
            </Button>
          </div>
        </div>

        {/* Accordions */}
        <div className="pt-8 space-y-4">
          <Accordion type="single" collapsible defaultValue="about">
            <AccordionItem value="about">
              <AccordionTrigger className="text-base font-medium text-[#3A0F0E]">
                {t("details.about", { lng: isMounted ? undefined : "en" })}
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className="text-sm text-[#3A0F0E]/80 leading-relaxed py-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: product.description || t("details.noDescription"),
                  }}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
              <AccordionTrigger className="text-base font-medium text-[#3A0F0E]">
                {t("details.sizeChart", { lng: isMounted ? undefined : "en" })}
              </AccordionTrigger>
              <AccordionContent>
                <div className="relative w-full aspect-video">
                  <Image
                    src="/size-chart.webp"
                    alt="Size Chart"
                    fill
                    className="object-contain"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

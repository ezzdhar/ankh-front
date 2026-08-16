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
import { useAuth } from "@/providers/AuthProvider";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductInfo({ product }: { product: Product }) {
  const { t } = useTranslation(["product", "auth"]);
  const isMounted = useIsMounted();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingAction, setLoadingAction] = useState<"cart" | "buy_now" | null>(null);
  const addToCart = useAddToCart();
  const toggleFavorite = useToggleFavorite();

  const checkAuth = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || Cookies.get("token")
        : null;
    return isAuthenticated || !!token;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("share.copied", { lng: isMounted ? undefined : "en" }) || "Link copied to clipboard!");
  };

  const handleToggleFavorite = () => {
    if (!checkAuth()) {
      toast.error(
        t("loginRequiredGeneric", {
          ns: "auth",
          lng: isMounted ? undefined : "en",
        }) || "You must login first to continue",
      );
      return;
    }
    toggleFavorite.mutate(product.id);
  };

  // Extract variants
  const variants = useMemo(() => product.variants || [], [product.variants]);
  const showVariants =
    variants.length > 1 ||
    (variants.length === 1 && (variants[0].attribute_values?.length ?? 0) > 0);

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

  // Group attribute values from variants into categories (e.g. Size, Color)
  const attributesMap = useMemo(() => {
    const map: Record<
      string,
      {
        id: number;
        name: string;
        values: Array<{ id: number; name: string; color_code?: string }>;
      }
    > = {};

    variants.forEach((v) => {
      v.attribute_values?.forEach((attr) => {
        const attrName = attr.attribute.name;
        if (!map[attrName]) {
          map[attrName] = {
            id: attr.attribute.id,
            name: attrName,
            values: [],
          };
        }
        if (!map[attrName].values.some((val) => val.name === attr.name)) {
          map[attrName].values.push({
            id: attr.id,
            name: attr.name,
            color_code: attr.color_code,
          });
        }
      });
    });
    return Object.values(map);
  }, [variants]);

  const getSelectedValueForAttribute = useCallback(
    (attrName: string) => {
      const found = selectedVariant?.attribute_values?.find(
        (attr) => attr.attribute.name === attrName,
      );
      return found ? found.name : "";
    },
    [selectedVariant],
  );

  const handleSelectAttribute = useCallback(
    (attrName: string, valueName: string) => {
      const otherAttributes: Record<string, string> = {};
      selectedVariant?.attribute_values?.forEach((attr) => {
        if (attr.attribute.name !== attrName) {
          otherAttributes[attr.attribute.name] = attr.name;
        }
      });

      let bestVariant = null;
      let bestMatchCount = -1;

      for (const variant of variants) {
        const matchesAttr = variant.attribute_values?.some(
          (attr) => attr.attribute.name === attrName && attr.name === valueName,
        );
        if (!matchesAttr) continue;

        let matchCount = 0;
        variant.attribute_values?.forEach((attr) => {
          if (
            attr.attribute.name !== attrName &&
            otherAttributes[attr.attribute.name] === attr.name
          ) {
            matchCount++;
          }
        });

        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestVariant = variant;
        }
      }

      if (bestVariant) {
        setSelectedVariantId(bestVariant.id);
      }
    },
    [variants, selectedVariant],
  );

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
    if (!checkAuth()) {
      toast.error(
        t("login.loginRequired", {
          ns: "auth",
          lng: isMounted ? undefined : "en",
        }) || "You must login first to add products to cart",
      );
      return;
    }

    const payload = getCartPayload();
    if (!payload) {
      return;
    }

    setLoadingAction("cart");
    addToCart.mutate(payload, {
      onSettled: () => setLoadingAction(null),
    });
  };

  const handleBuyNow = () => {
    if (!checkAuth()) {
      toast.error(
        t("login.loginRequired", {
          ns: "auth",
          lng: isMounted ? undefined : "en",
        }) || "You must login first to add products to cart",
      );
      return;
    }

    const payload = getCartPayload();
    if (!payload) {
      return;
    }

    setLoadingAction("buy_now");
    addToCart.mutate(payload, {
      onSuccess: () => {
        router.push("/cart");
      },
      onSettled: () => {
        setLoadingAction(null);
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

        {/* Variant Selectors */}
        {showVariants && (
          <div className="space-y-4">
            {variants.length > 1 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  {attributesMap.map((attr) => {
                    const currentValue = getSelectedValueForAttribute(attr.name);
                    return (
                      <div key={attr.name} className="flex-1 flex flex-col gap-2">
                        <span className="text-xs font-semibold text-[#3A0F0E] uppercase tracking-wider">
                          {attr.name}
                        </span>
                        <Select
                          value={currentValue}
                          onValueChange={(val) => handleSelectAttribute(attr.name, val)}
                        >
                          <SelectTrigger className="w-full h-11 bg-white border-[#3A0F0E]/15 text-[#3A0F0E] rounded-xl focus:border-[#C6943E] shadow-sm hover:border-[#3A0F0E]/30 transition-all font-medium">
                            <SelectValue placeholder={`Select ${attr.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.values.map((val) => (
                              <SelectItem key={val.name} value={val.name}>
                                <div className="flex items-center gap-2">
                                  {val.color_code && (
                                    <div
                                      className="w-4 h-4 rounded-full border border-[#3A0F0E]/15 shrink-0"
                                      style={{ backgroundColor: val.color_code }}
                                    />
                                  )}
                                  <span>{val.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>

                {/* Stock Indicator */}
                {selectedVariant && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {selectedVariant.stock <= 0 ? (
                      <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        {t("details.outOfStock", {
                          lng: isMounted ? undefined : "en",
                        })}
                      </span>
                    ) : selectedVariant.stock <= LOW_STOCK_THRESHOLD ? (
                      <span className="text-xs font-bold text-[#C6943E] animate-pulse flex items-center gap-1.5">
                        <span className="w-2/5 h-2/5 rounded-full bg-[#C6943E] inline-block w-2 h-2" />
                        {t("details.lowStock", {
                          count: selectedVariant.stock,
                          lng: isMounted ? undefined : "en",
                        })}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {t("details.inStock") || "Available in stock"}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Single Variant Information Panel */
              <div className="bg-white border border-[#3A0F0E]/10 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C6943E]" />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3A0F0E]/30 uppercase tracking-[0.2em]">
                      {t("details.specifications") || "Product Specifications"}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#3A0F0E]/5 flex items-center justify-center text-[#3A0F0E]/20">
                      <Plus size={14} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {variants[0].attribute_values.map((attr) => (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between border-b border-[#3A0F0E]/5 pb-2"
                      >
                        <span className="text-sm text-[#3A0F0E]/60 font-medium">
                          {attr.attribute.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {attr.color_code && (
                            <div
                              className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                              style={{ backgroundColor: attr.color_code }}
                            />
                          )}
                          <span className="text-sm font-bold text-[#3A0F0E]">
                            {attr.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
              disabled={addToCart.isPending && loadingAction === "cart"}
              onClick={handleAddToCart}
              className="flex-1 h-12 border-2 border-[#3A0F0E] text-[#3A0F0E] text-sm font-medium rounded-full hover:bg-[#3A0F0E] hover:text-white transition-all uppercase tracking-wider"
            >
              {addToCart.isPending && loadingAction === "cart"
                ? t("details.adding", { lng: isMounted ? undefined : "en" })
                : t("details.addToCart", { lng: isMounted ? undefined : "en" })}
            </Button>

            <Button
              disabled={addToCart.isPending && loadingAction === "buy_now"}
              onClick={handleBuyNow}
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

"use client";

import dynamic from "next/dynamic";
import { CollectionCarousel } from "@/components/home/CollectionCarousel";
import { Hero } from "@/components/home/Hero";
import { useTranslation } from "@/i18n/hooks";
import { useCategories, useRandomProducts } from "@/hooks/useProducts";
import { useInspired } from "@/hooks/useInspired";
import { useBanners } from "@/hooks/useBanners";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-fold components to reduce initial JS bundle
const WinterCollection = dynamic(
  () =>
    import("@/components/home/WinterCollection").then(
      (mod) => mod.WinterCollection,
    ),
  {
    loading: () => (
      <div className="w-full aspect-9/16 md:aspect-auto md:h-[calc(100vh-60px)] bg-[#310E0E] animate-pulse" />
    ),
  },
);

const NewCollection = dynamic(
  () =>
    import("@/components/home/NewCollection").then((mod) => mod.NewCollection),
  {
    loading: () => (
      <div className="w-full aspect-9/16 md:aspect-auto md:h-[calc(100vh-60px)] bg-[#3A0F0E] animate-pulse" />
    ),
  },
);

const InstagramSection = dynamic(
  () =>
    import("@/components/home/InstagramSection").then(
      (mod) => mod.InstagramSection,
    ),
  {
    loading: () => (
      <div className="w-full py-16">
        <div className="container mx-auto px-6">
          <Skeleton className="h-8 w-48 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export function HomeContent() {
  const { t } = useTranslation("home");
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const { data: randomProductsData, isLoading: isProductsLoading } =
    useRandomProducts();
  const { data: inspiredData, isLoading: isInspiredLoading } = useInspired();
  const { data: bannersData, isLoading } = useBanners();

  const heroBanner = bannersData?.data?.[0];
  const winterBanner = bannersData?.data?.[1];
  const newCollectionBanner = bannersData?.data?.[2];

  const categoryItems = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map((cat) => ({
      id: cat.id,
      image: cat.image || "",
      title: cat.name,
      link: `/search?category=${cat.id}`,
    }));
  }, [categoriesData]);

  const randomProductItems = useMemo(() => {
    if (!randomProductsData?.data) return [];
    return randomProductsData.data.map((product) => ({
      id: product.id,
      image: product.main_image || product.image || "",
      title: product.name,
      price: product.price,
      price_after_discount: product.price_after_discount,
      link: `/product/${product.slug}`,
    }));
  }, [randomProductsData]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-12">
      <Hero
        key={heroBanner?.image || "hero-default"}
        image={heroBanner?.image}
        title={heroBanner?.name}
        description={heroBanner?.description}
        link={"/search"}
        isLoading={isLoading || !bannersData}
      />
      <CollectionCarousel
        title={t("collections.title")}
        items={categoryItems}
        isLoading={isCategoriesLoading}
      />
      <WinterCollection
        image={winterBanner?.image}
        title={winterBanner?.name}
        link={"/search"}
      />
      <CollectionCarousel
        title={t("newest")}
        items={randomProductItems}
        isProduct={true}
        isLoading={isProductsLoading}
      />
      <NewCollection
        image={newCollectionBanner?.image}
        title={newCollectionBanner?.name}
        link={"/search"}
      />
      <InstagramSection
        items={inspiredData?.data}
        isLoading={isInspiredLoading}
      />
    </div>
  );
}

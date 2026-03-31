import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { ProductDetails } from "./ProductDetails";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getProduct(id: string) {
  try {
    const res = await fetch(`https://admin.ankh-eg.com/api/v1/products/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const json = (await res.ok) ? await res.json() : null;
    return json?.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = (await params).id;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | ANKH",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description:
      product.description || `Buy ${product.name} at ANKH Fashion Store.`,
    openGraph: {
      title: product.name,
      description:
        product.description || `Buy ${product.name} at ANKH Fashion Store.`,
      url: `https://ankh-eg.com/product/${id}`,
      siteName: "ANKH",
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
        ...previousImages,
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description || `Buy ${product.name} at ANKH Fashion Store.`,
      images: [product.image],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const id = (await params).id;

  return (
    <Suspense fallback={null}>
      <ProductDetails id={id} />
    </Suspense>
  );
}

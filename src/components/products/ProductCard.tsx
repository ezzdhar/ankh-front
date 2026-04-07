import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const href = product.link || `/product/${product.slug}`;
  const img = product.main_image || product.image;
  const name = product.name || product.title;
  const oldPrice = product.original_price || product.old_price;
  const hasDiscount =
    product.has_discount ||
    (oldPrice && Number(oldPrice) > Number(product.price));

  return (
    <Link href={href} className={cn("block group/item h-full", className)}>
      <div className="relative aspect-3/4 overflow-hidden mb-4 bg-gray-100">
        {img ? (
          <Image
            src={img}
            alt={name || "Product Image"}
            fill
            className="object-cover transition-transform duration-700 group-hover/item:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}

        {/* Optional: Add tags like 'Sale' or 'New' absolute positioned here */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-maroon text-white text-xs px-2 py-1 uppercase tracking-widest">
            Sale
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 items-center">
        <h3 className="text-center text-sm md:text-base font-medium tracking-widest uppercase text-maroon line-clamp-1">
          {name}
        </h3>

        {product.average_rating !== undefined && product.average_rating > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.average_rating || 0) ? "#facc15" : "none"}
                className={
                  i < Math.floor(product.average_rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">
              ({product.reviews_count || 0})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center mt-1">
          <div className="text-sm md:text-base font-bold text-[#3A0F0E]">
            {product.price} {product.currency || "EGP"}
          </div>
          {hasDiscount && oldPrice && (
            <div className="text-xs md:text-sm text-gray-400 line-through">
              {oldPrice} {product.currency || "EGP"}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

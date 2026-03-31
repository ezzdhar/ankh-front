"use client";

import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  main_image?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="flex flex-col items-center group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-3/4 mb-4 overflow-hidden bg-gray-100">
        {product.main_image || product.image ? (
          <Image
            src={product.main_image || product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-xs md:text-sm text-[#3A0F0E] text-center tracking-wide uppercase font-medium mb-1">
        {product.title}
      </h3>
      <p className="text-sm md:text-base text-[#3A0F0E] font-cormorant font-semibold">
        {product.price}
      </p>
    </Link>
  );
}

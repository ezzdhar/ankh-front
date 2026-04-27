import { Metadata } from "next";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Shop Collection",
  description:
    "Browse our full collection of fashion items. Filter by category, price, and rating to find your perfect style.",
};

export default function SearchPage() {
  return <SearchClient />;
}

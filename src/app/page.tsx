import { Metadata } from "next";
import { HomeContent } from "./HomeContent";

export const metadata: Metadata = {
  title: "ANKH | Leading Fashion Store in Egypt",
  description:
    "Explore ANKH's latest fashion collections. Buy high-quality coats, knitwear, denim, and dresses online at the best prices in Egypt. Shop now for modern, stylish clothing.",
  openGraph: {
    title: "ANKH | Leading Fashion Store in Egypt",
    description:
      "Explore ANKH's latest fashion collections. Modern clothing for every taste.",
    images: [
      {
        url: "https://ankh-eg.com/logo_white.svg",
        width: 1200,
        height: 630,
        alt: "ANKH Fashion Store Logo",
      },
    ],
  },
};

export default function Home() {
  return <HomeContent />;
}

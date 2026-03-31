import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ankh-eg.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/search",
    "/cart",
    "/wishlist",
    "/login",
    "/register",
    "/privacy-policy",
    "/refund-policy",
    "/shipping-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}

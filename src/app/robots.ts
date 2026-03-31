import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ankh-eg.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/profile",
        "/addresses",
        "/add-address",
        "/orders",
        "/change-password",
        "/checkout",
        "/otp",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

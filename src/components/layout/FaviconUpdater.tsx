"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const API_BASE_URL = "https://admin.ankh-eg.com";

export function FaviconUpdater() {
  const { data: settings } = useSiteSettings();
  const favicon = settings?.data?.favicon;

  useEffect(() => {
    if (!favicon) return;

    const faviconUrl = favicon.startsWith("http")
      ? favicon
      : `${API_BASE_URL}/storage/${favicon}`;

    // Update existing favicon links
    const existingLinks = document.querySelectorAll(
      "link[rel='icon'], link[rel='shortcut icon']",
    );
    existingLinks.forEach((link) => {
      (link as HTMLLinkElement).href = faviconUrl;
    });

    // If no favicon link exists, create one
    if (existingLinks.length === 0) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = faviconUrl;
      document.head.appendChild(link);
    }
  }, [favicon]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useTranslation } from "@/i18n/hooks";

export function LanguageManager() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || "en";
    const dir = i18n.language.startsWith("ar") ? "rtl" : "ltr";

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [i18n.language]);

  return null;
}

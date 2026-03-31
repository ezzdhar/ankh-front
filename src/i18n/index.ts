"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { i18nConfig } from "./config";
import resources from "./resources";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    resources,
  });

export default i18n;

export const currentLang = () => i18n.language;
export const isArabic = () => i18n.language.startsWith("ar");
export const isRTL = () => isArabic();

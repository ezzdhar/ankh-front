"use client";

import { useTranslation as useI18nTranslation } from "react-i18next";
import { Namespaces } from "./resources";

export const useTranslation = (ns?: Namespaces | Namespaces[]) => {
  return useI18nTranslation(ns as string | string[]);
};

export type TranslationFunction = ReturnType<typeof useTranslation>[0];

export const defaultNS = "common" as const;
export const fallbackLng = "en" as const;
export const supportedLngs = ["en", "ar"] as const;

export type SupportedLanguage = (typeof supportedLngs)[number];

export const i18nConfig = {
  fallbackLng,
  defaultNS,
  ns: ["common", "home", "about", "auth", "address", "orders"],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["cookie", "localStorage", "navigator", "htmlTag"],
    caches: ["cookie", "localStorage"],
    lookupCookie: "i18next",
    lookupLocalStorage: "i18nextLng",
  },
  supportedLngs,
};

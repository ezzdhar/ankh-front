"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useIsMounted } from "@/hooks/useIsMounted";

const API_BASE_URL = "https://admin.ankh-eg.com";

const paymentIcons = [
  { src: "/payments/apple_pay_mini.svg", alt: "Apple Pay" },
  { src: "/payments/credit_card_mini.svg", alt: "Visa" },
  { src: "/payments/paymob.svg", alt: "Paymob" },
  { src: "/payments/orange_money.svg", alt: "Orange Money" },
  { src: "/payments/vodafone_cash.svg", alt: "Vodafone Cash" },
  { src: "/payments/valu.svg", alt: "Valu" },
];

export function Footer() {
  const { t } = useTranslation("common");
  const isMounted = useIsMounted();
  const { data: settingsData } = useSiteSettings();
  const settings = settingsData?.data;

  const logoUrl = settings?.logo_white
    ? settings.logo_white.startsWith("http")
      ? settings.logo_white
      : `${API_BASE_URL}/storage/${settings.logo_white}`
    : "/logo_white.svg";

  const quickLinks = [
    { label: t("footer.home", { lng: isMounted ? undefined : "en" }), href: "/" },
    { label: t("footer.products", { lng: isMounted ? undefined : "en" }), href: "/search" },
    { label: t("footer.aboutUs", { lng: isMounted ? undefined : "en" }), href: "/about" },
  ];

  const supportLinks = [
    { label: t("footer.myAccount", { lng: isMounted ? undefined : "en" }), href: "/profile" },
    { label: t("footer.myOrders", { lng: isMounted ? undefined : "en" }), href: "/orders" },
    { label: t("footer.wishlist", { lng: isMounted ? undefined : "en" }), href: "/wishlist" },
  ];

  const policyLinks = [
    { label: t("footer.terms", { lng: isMounted ? undefined : "en" }), href: "/terms" },
    { label: t("footer.privacyPolicy", { lng: isMounted ? undefined : "en" }), href: "/privacy-policy" },
    { label: t("footer.shippingPolicy", { lng: isMounted ? undefined : "en" }), href: "/shipping-policy" },
    { label: t("footer.refundPolicy", { lng: isMounted ? undefined : "en" }), href: "/refund-policy" },
  ];

  return (
    <footer className="w-full block bg-maroon text-white mt-10 px-16 pt-10 pb-5 max-sm:px-4">
      {/* Main Footer */}
      <div className="container py-12 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/">
              <Image
                src={logoUrl}
                alt="ANKH"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              {settings?.description ||
                "An online fashion store offering stylish, high-quality pieces at competitive prices to suit all tastes."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium tracking-wide">
              {t("footer.quickLinks", { lng: isMounted ? undefined : "en" })}
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1 rtl:hover:-translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium tracking-wide">
              {t("footer.customerSupport", { lng: isMounted ? undefined : "en" })}
            </h3>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1 rtl:hover:-translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium tracking-wide">
              {t("footer.contactInfo", { lng: isMounted ? undefined : "en" })}
            </h3>
            <ul className="flex flex-col gap-3">
              {settings?.phone && (
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <Phone size={16} className="shrink-0" />
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <Mail size={16} className="shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="shrink-0"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <a
                    href={`https://wa.me/${settings.phone.replace(/[\s+]/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-white/60">
              {t("footer.copyright", { year: new Date().getFullYear(), lng: isMounted ? undefined : "en" })}
            </p>

            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              {paymentIcons.map((icon) => (
                <div
                  key={icon.alt}
                  className="w-10 h-6 bg-white rounded flex items-center justify-center p-1 hover:scale-110 transition-transform duration-300 cursor-pointer"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={32}
                    height={20}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-white/60 hover:text-white transition-colors hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

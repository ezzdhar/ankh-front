import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ankh-eg.com"),
  title: {
    default: "ANKH | متجر أزياء",
    template: "%s | ANKH",
  },
  description:
    "متجر أزياء إلكتروني يقدم قطعاً أنيقة وعالية الجودة بأسعار تنافسية تناسب جميع الأذواق. اكتشف أحدث تشكيلاتنا من المعاطف، الملابس المحبوكة، الجينز، والفساتين.",
  keywords: [
    "أزياء",
    "ملابس",
    "ANKH",
    "متجر إلكتروني",
    "أزياء مصر",
    "فساتين",
    "جينز",
    "تريكو",
    "Fashion",
    "Clothing",
  ],
  authors: [{ name: "ANKH" }],
  creator: "ANKH",
  publisher: "ANKH",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo_white.svg",
    shortcut: "/logo_white.svg",
    apple: "/logo_white.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ANKH | متجر أزياء",
    description:
      "متجر أزياء إلكتروني يقدم قطعاً أنيقة وعالية الجودة بأسعار تنافسية تناسب جميع الأذواق.",
    url: "https://ankh-eg.com",
    siteName: "ANKH",
    images: [
      {
        url: "https://ankh-eg.com/logo_white.svg",
        width: 800,
        height: 600,
        alt: "ANKH Fashion Store",
        type: "image/svg+xml",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANKH | متجر أزياء",
    description:
      "متجر أزياء عصري يقدم ملابس وإكسسوارات عالية الجودة بأسعار تنافسية.",
    images: ["https://ankh-eg.com/logo_white.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${cairo.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://admin.ankh-eg.com" />
        <link rel="dns-prefetch" href="https://admin.ankh-eg.com" />
      </head>
      <body suppressHydrationWarning>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-27J3ZJV7S4"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-27J3ZJV7S4');
          `}
        </Script>
        <Providers>
          <Navbar />
          <main className="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

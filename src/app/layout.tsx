import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
    default: "ANKH | Fashion Store",
    template: "%s | ANKH",
  },
  description:
    "An online fashion store offering stylish, high-quality pieces at competitive prices to suit all tastes. Discover our latest collections of coats, knitwear, denim, and dresses.",
  keywords: [
    "Fashion",
    "Clothing",
    "ANKH",
    "Online Store",
    "Egypt Fashion",
    "Dresses",
    "Denim",
    "Knitwear",
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
    title: "ANKH | Fashion Store",
    description:
      "An online fashion store offering stylish, high-quality pieces at competitive prices to suit all tastes.",
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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANKH | Fashion Store",
    description:
      "Modern fashion store offering high-quality clothing and accessories.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${cairo.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://admin.ankh-eg.com" />
        <link rel="dns-prefetch" href="https://admin.ankh-eg.com" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

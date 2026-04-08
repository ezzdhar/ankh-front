"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  AlignRight as MenuIcon,
  UserRound,
  ShoppingCart,
  Globe,
  LogOut,
  Heart,
} from "lucide-react";
import i18n from "@/i18n";
import { useTranslation } from "@/i18n/hooks";
import Image from "next/image";
import { Input } from "../ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { useIsMounted } from "@/hooks/useIsMounted";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export function Navbar() {  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(["common", "cart", "auth"]);
  const { isAuthenticated, user: authUser, logout: authLogout } = useAuth();
  const { getProfile, logout: profileLogout } = useProfile();
  const isMounted = useIsMounted();
  const isArabic = isMounted && i18n.language === "ar";
  const user = getProfile.data?.data || authUser;

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    router.push(`/search?search=${encodedQuery}`);
  };

  const toggleLanguage = () => {
    const newLang = isArabic ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`; // Standard Next.js server cookie
    document.cookie = `i18nextLng=${newLang}; path=/; max-age=31536000`; // i18next cookie
    window.location.reload();
  };

  const handleLogout = () => {
    profileLogout.mutate(undefined, {
      onSettled: () => {
        authLogout();
        setIsMenuOpen(false);
        router.push("/");
      },
    });
  };

  const navLinks = [
    { href: "/", label: t("nav.home", { lng: isMounted ? undefined : "en" }) },
    { href: "/about", label: t("nav.about", { lng: isMounted ? undefined : "en" }) },
    { href: "/search", label: t("nav.products", { lng: isMounted ? undefined : "en" }) },
    { href: "/cart", label: t("title", { ns: "cart", lng: isMounted ? undefined : "en" }) },
    { href: "/wishlist", label: t("footer.wishlist", { lng: isMounted ? undefined : "en" }) },
    { href: "/orders", label: t("footer.myOrders", { lng: isMounted ? undefined : "en" }) },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 px-5! h-[60px] bg-[#FFF8EF] shadow-sm z-50">
      <div className="max-w-[1440px] h-full mx-auto flex items-center justify-between">
        {/* Left Side - Icons */}
        <div className="flex items-center gap-2 sm:gap-5 flex-none relative z-10 text-[#442524]">
          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className="p-2 hover:opacity-60 transition-opacity flex items-center justify-center focus:outline-none"
            aria-label="Account"
          >
            {isMounted && isAuthenticated && user?.image ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#3A0F0E]/10 bg-[#EBE5E0]">
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <UserRound size={24} strokeWidth={1} />
            )}
          </Link>
          <Link
            href="/wishlist"
            className="p-2 hover:opacity-60 transition-opacity hidden sm:flex"
            aria-label={t("footer.wishlist", { lng: isMounted ? undefined : "en" })}
          >
            <Heart size={24} strokeWidth={1} />
          </Link>
          <Link
            href="/cart"
            className="p-2 hover:opacity-60 transition-opacity"
            aria-label="Cart"
          >
            <ShoppingCart size={24} strokeWidth={1} />
          </Link>
          <button
            className="p-2 hover:opacity-60 transition-opacity hidden sm:flex"
            aria-label="Language"
            onClick={toggleLanguage}
          >
            <Globe size={24} strokeWidth={1} />
          </button>

          {isAuthenticated && (
            <button
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut size={24} strokeWidth={1} />
            </button>
          )}
        </div>

        {/* Center - Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-logo text-2xl md:text-[1.75rem] font-light tracking-[0.15em] text-[#3A0F0E] hover:opacity-70 transition-opacity z-0"
        >
          <Image
            src="/logo.svg"
            alt="Ankh"
            width={100}
            height={40}
            className="h-9 sm:h-10 w-auto"
            loading="eager"
            priority
          />
        </Link>

        {/* Right Side - Search & Menu */}
        <div className="flex items-center gap-4 flex-none relative z-10">
          {/* Search Bar - Desktop */}
          <div className="relative hidden md:flex items-center">
            <Input
              type="text"
              placeholder={
                t("search.placeholder", { lng: isMounted ? undefined : "en" })
              }
              className="w-[260px] focus:w-[270px] py-2.5 px-4 ps-3! border border-[#310E0E]/90! rounded-full bg-transparent font-primary text-sm text-[#310E0E]/90! placeholder:text-[#310E0E]/60 outline-none focus:border-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="absolute end-2 top-1/2 -translate-y-1/2 p-2 text-[#442524] hover:opacity-60 transition-colors"
            >
              <Search size={20} strokeWidth={1} />
            </button>
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="p-2 text-[#442524] hover:opacity-60 transition-opacity md:hidden"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={24} strokeWidth={1} />
          </button>

          {/* Menu Button - Updated to use Sheet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 text-[#442524] hover:opacity-60 transition-opacity focus:outline-none"
                aria-label="Menu"
              >
                <MenuIcon size={24} strokeWidth={1} />
              </button>
            </SheetTrigger>
            <SheetContent
              side={isArabic ? "left" : "right"}
              className="w-[300px] sm:w-[400px] border-none pt-16 px-6"
            >
              <SheetHeader className="hidden">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-4 text-[#3A0F0E] font-primary text-xl font-medium border-b border-black/5 last:border-b-0 hover:ps-2 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Additional Mobile-only items */}
                <div className="mt-8 flex flex-col gap-6">
                  <button
                    className="flex items-center gap-6 sm:hidden text-[#442524] font-primary text-lg font-medium hover:opacity-60 transition-opacity"
                    onClick={() => {
                      toggleLanguage();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Globe size={24} strokeWidth={1} />
                    {isMounted ? (isArabic ? "English" : "العربية") : "العربية"}
                  </button>

                  {isAuthenticated ? (
                    <button
                      className="flex items-center gap-4 text-red-600 font-primary text-lg font-medium hover:opacity-60 transition-opacity"
                      onClick={handleLogout}
                    >
                      <LogOut size={24} strokeWidth={1} />
                      {t("logout", { ns: "auth", lng: isMounted ? undefined : "en" })}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 text-[#442524] font-primary text-lg font-medium hover:opacity-60 transition-opacity"
                    >
                      <UserRound size={24} strokeWidth={1} />
                      {t("login.submit", { ns: "auth", lng: isMounted ? undefined : "en" })}
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-[60px] left-0 right-0 p-3 bg-[#FFF8EF] shadow-sm flex items-center gap-3 md:hidden">
          <Input
            type="text"
            placeholder={
              t("search.placeholder", { lng: isMounted ? undefined : "en" })
            }
            autoFocus
            className="flex-1 py-3 px-4 border border-[#310E0E]/90! rounded-full bg-transparent font-primary text-sm text-[#310E0E]/90! placeholder:text-[#310E0E]/60 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} aria-label="Search" className="p-2">
            <Search size={20} strokeWidth={1} className="text-[#442524]" />
          </button>
        </div>
      )}
    </header>
  );
}

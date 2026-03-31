"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, User, ShoppingBag, Globe, LogOut } from "lucide-react";
import i18n from "@/i18n";
import { useTranslation } from "@/i18n/hooks";
import Image from "next/image";
import { Input } from "../ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";

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
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isAuthenticated, logout: authLogout } = useAuth();
  const { logout: profileLogout } = useProfile();
  const isArabic = i18n.language === "ar";

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
  };

  const handleLogout = () => {
    profileLogout.mutate(undefined, {
      onSettled: () => {
        authLogout();
        router.push("/");
      },
    });
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/search", label: t("nav.products") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 px-5! h-[60px] bg-[#FAF6F1] border-b border-black/10 z-50">
      <div className="max-w-[1440px] h-full mx-auto flex items-center justify-between">
        {/* Left Side - Icons */}
        <div className="flex items-center gap-5">
          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className="p-2 text-[#3A0F0E] hover:opacity-60 transition-opacity"
            aria-label="Account"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            className="p-2 text-[#3A0F0E] hover:opacity-60 transition-opacity"
            aria-label="Cart"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
          <button
            className="p-2 text-[#3A0F0E] hover:opacity-60 transition-opacity hidden sm:flex"
            aria-label="Language"
            onClick={toggleLanguage}
          >
            <Globe size={20} strokeWidth={1.5} />
          </button>

          {isAuthenticated && (
            <button
              className="p-2 text-red-600 hover:opacity-60 transition-opacity"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut size={20} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Center - Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-logo text-2xl md:text-[1.75rem] font-light tracking-[0.15em] text-[#3A0F0E] hover:opacity-70 transition-opacity"
        >
          <Image
            src="/logo.svg"
            alt="Ankh"
            width={100}
            height={40}
            className="h-10 w-auto"
            loading="eager"
            priority
          />
        </Link>

        {/* Right Side - Search & Menu */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Desktop */}
          <div className="relative hidden md:flex items-center">
            <Input
              type="text"
              placeholder={
                isArabic ? "ما الذي تبحث عنه؟" : "What are you looking for?"
              }
              className="w-[260px] focus:w-[270px] py-2.5 px-4 ps-3! border border-black/15 rounded-full bg-transparent font-primary text-sm text-[#3A0F0E] placeholder:text-[#999] outline-none focus:border-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="absolute end-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-[#3A0F0E] transition-colors"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="p-2 text-[#3A0F0E] hover:opacity-60 transition-opacity md:hidden"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Menu Button - Updated to use Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 text-[#3A0F0E] hover:opacity-60 transition-opacity focus:outline-none"
                aria-label="Menu"
              >
                <Menu size={22} strokeWidth={1.5} />
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
                    className="py-4 text-[#3A0F0E] font-primary text-xl font-medium border-b border-black/5 last:border-b-0 hover:ps-2 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Additional Mobile-only items */}
                <div className="mt-8 flex flex-col gap-6">
                  <button
                    className="flex items-center gap-6 sm:hidden text-[#3A0F0E] font-primary text-lg font-medium hover:opacity-60 transition-opacity"
                    onClick={toggleLanguage}
                  >
                    <Globe size={22} strokeWidth={1.5} />
                    {isArabic ? "English" : "العربية"}
                  </button>

                  {isAuthenticated ? (
                    <button
                      className="flex items-center gap-4 text-red-600 font-primary text-lg font-medium hover:opacity-60 transition-opacity"
                      onClick={handleLogout}
                    >
                      <LogOut size={22} strokeWidth={1.5} />
                      {isArabic ? "تسجيل الخروج" : "Logout"}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-4 text-[#3A0F0E] font-primary text-lg font-medium hover:opacity-60 transition-opacity"
                    >
                      <User size={22} strokeWidth={1.5} />
                      {isArabic ? "تسجيل الدخول" : "Login"}
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
        <div className="absolute top-[60px] left-0 right-0 p-3 bg-[#FAF6F1] border-b border-black/10 flex items-center gap-3 md:hidden">
          <Input
            type="text"
            placeholder={
              isArabic ? "ما الذي تبحث عنه؟" : "What are you looking for?"
            }
            autoFocus
            className="flex-1 py-3 px-4 border border-black/15 rounded-full bg-transparent font-primary text-sm text-[#3A0F0E] placeholder:text-[#999] outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} aria-label="Search" className="p-2">
            <Search size={18} strokeWidth={1.5} className="text-[#666]" />
          </button>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import * as libphonenumber from "google-libphonenumber";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { COUNTRIES, Country } from "@/constants/countries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

interface CustomPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  defaultCountryCode?: string;
  dir?: "rtl" | "ltr";
  className?: string;
  error?: boolean;
  allowedCountries?: string[];
}

const getFlagUrl = (code: string) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

// Get max length for a country's phone number
const getMaxLength = (countryCode: string): number => {
  try {
    const exampleNumber = phoneUtil.getExampleNumberForType(
      countryCode,
      libphonenumber.PhoneNumberType.MOBILE,
    );
    if (exampleNumber) {
      const nationalNumber =
        exampleNumber.getNationalNumber()?.toString() || "";
      return nationalNumber.length;
    }
  } catch {
    // Fallback to reasonable default
  }
  return 15; // Default max length
};

export function CustomPhoneInput({
  value = "",
  onChange,
  onBlur,
  placeholder,
  defaultCountryCode = "EG",
  dir = "ltr",
  className,
  error,
  allowedCountries,
}: CustomPhoneInputProps) {
  // Filter countries if allowedCountries is provided
  const availableCountries = React.useMemo(() => {
    if (!allowedCountries || allowedCountries.length === 0) return COUNTRIES;
    return COUNTRIES.filter((c) => allowedCountries.includes(c.code));
  }, [allowedCountries]);

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    availableCountries.find((c) => c.code === defaultCountryCode) ||
      availableCountries[0],
  );
  const [localNumber, setLocalNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [maxLength, setMaxLength] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external value
  useEffect(() => {
    if (value && value !== `${selectedCountry.dialCode}${localNumber}`) {
      try {
        const number = phoneUtil.parseAndKeepRawInput(value);
        const regionCode = phoneUtil.getRegionCodeForNumber(number);
        const country = COUNTRIES.find((c) => c.code === regionCode);

        if (country) {
          setSelectedCountry(country);
          const nationalNumber = number.getNationalNumber()?.toString() || "";
          setLocalNumber(nationalNumber);
          setIsValid(phoneUtil.isValidNumber(number));
          setMaxLength(getMaxLength(country.code));
        } else {
          const foundByDial = COUNTRIES.find((c) =>
            value.startsWith(c.dialCode),
          );
          if (foundByDial) {
            setSelectedCountry(foundByDial);
            setLocalNumber(value.replace(foundByDial.dialCode, "").trim());
            setMaxLength(getMaxLength(foundByDial.code));
          }
        }
      } catch {
        const foundByDial = COUNTRIES.find((c) => value.startsWith(c.dialCode));
        if (foundByDial) {
          setSelectedCountry(foundByDial);
          setLocalNumber(value.replace(foundByDial.dialCode, "").trim());
          setMaxLength(getMaxLength(foundByDial.code));
        } else {
          setLocalNumber(value);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle scroll for virtual rendering
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop } = scrollContainerRef.current;
    const itemHeight = 40;
    const buffer = 5;

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const end = Math.min(availableCountries.length, start + 20 + buffer);

    setVisibleRange({ start, end });
  }, [availableCountries.length]);

  const validateAndNotify = useCallback(
    (dialCode: string, numberStr: string) => {
      const fullNumber = `${dialCode}${numberStr}`;
      let valid = false;
      try {
        const parsed = phoneUtil.parseAndKeepRawInput(fullNumber);
        valid = phoneUtil.isValidNumber(parsed);
      } catch {
        valid = false;
      }
      setIsValid(valid);
      onChange?.(fullNumber);
    },
    [onChange],
  );

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setMaxLength(getMaxLength(country.code));
    setIsOpen(false);

    // Truncate existing number if it exceeds new max length
    const newMaxLength = getMaxLength(country.code);
    const truncatedNumber = localNumber.slice(0, newMaxLength);
    setLocalNumber(truncatedNumber);

    validateAndNotify(country.dialCode, truncatedNumber);

    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");

    // Immediately update local state for smooth typing
    setLocalNumber(val);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce validation and onChange callback
    debounceTimerRef.current = setTimeout(() => {
      validateAndNotify(selectedCountry.dialCode, val);
    }, 300);
  };

  // Get visible countries
  const visibleCountries = availableCountries.slice(
    visibleRange.start,
    visibleRange.end,
  );
  const itemHeight = 40;

  return (
    <div
      className={cn(
        "flex items-center gap-0 w-full h-[45px] border rounded-md bg-transparent overflow-hidden transition-all",
        error || !isValid
          ? "border-red-500 focus-within:ring-red-500"
          : "border-[#5C2C28] focus-within:ring-[#5C2C28]",
        "focus-within:ring-1",
        className,
      )}
      dir={dir}
    >
      {/* Country Selector */}
      <div className="shrink-0 h-full flex items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-full w-[100px] border-none bg-transparent px-3 focus:ring-0 focus:ring-offset-0 shadow-none outline-none flex items-center justify-between gap-1"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-4 shrink-0">
                  <Image
                    src={getFlagUrl(selectedCountry.code)}
                    alt={selectedCountry.code}
                    fill
                    className="object-cover rounded-sm"
                    unoptimized
                  />
                </div>
                <span className="text-sm font-medium text-[#3A0F0E]">
                  {selectedCountry.dialCode}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#3A0F0E] opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="max-h-[300px] overflow-y-auto"
              style={{ position: "relative" }}
            >
              <div
                style={{
                  height: `${availableCountries.length * itemHeight}px`,
                  position: "relative",
                }}
              >
                {visibleCountries.map((country, idx) => {
                  const actualIndex = visibleRange.start + idx;
                  return (
                    <div
                      key={`${country.code}-${country.dialCode}`}
                      style={{
                        position: "absolute",
                        top: `${actualIndex * itemHeight}px`,
                        height: `${itemHeight}px`,
                        width: "100%",
                      }}
                      className="px-3 hover:bg-[#FFF8EF] cursor-pointer flex items-center gap-2 transition-colors"
                      onClick={() => handleCountryChange(country)}
                    >
                      <div className="relative w-6 h-4 shrink-0">
                        <Image
                          src={getFlagUrl(country.code)}
                          alt={country.code}
                          fill
                          className="object-cover rounded-sm"
                          unoptimized
                        />
                      </div>
                      <span className="text-sm text-[#3A0F0E]">
                        {country.name} ({country.dialCode})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Number Input */}
      <div className="flex-1 h-full">
        <input
          ref={inputRef}
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full h-full bg-transparent border-none px-2 text-[#3A0F0E] placeholder:text-[#8C8C8C] text-base focus:outline-none focus:ring-0 outline-none"
        />
      </div>
    </div>
  );
}

/**
 * Sanitizes a phone number by:
 * 1. Removing a redundant leading '0' if it appears after the country code.
 * 2. Removing all whitespace characters to get a continuous string.
 *
 * This handles cases like "+20 010..." -> "+2010..."
 * It avoids stripping zeros that are part of the country code itself.
 *
 * @param phone The raw phone number string
 * @returns A clean, continuous phone number string
 */
export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return "";

  // 1. Remove redundancy if a space exists (e.g. "+20 010..." -> "+20 10...")
  // This is safer because we know where the country code ends.
  let cleaned = phone.trim();

  // Match a country code format "+CC 0..." and remove the zero
  cleaned = cleaned.replace(/^(\+\d+)\s+0/, "$1 ");

  // 2. Remove all spaces
  cleaned = cleaned.replace(/\s/g, "");

  // 3. Specific fix for Egypt (+20) if no space was present but double zero exists
  // Example: "+20011..." (no space) -> "+2011..."
  if (cleaned.startsWith("+200")) {
    cleaned = "+20" + cleaned.slice(4);
  }

  return cleaned;
};

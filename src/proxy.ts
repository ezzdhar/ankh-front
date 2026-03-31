/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- 1. Rate Limiting Setup ---
const rateLimitMap = new Map();

function rateLimit(ip: string) {
  const windowMs = 60 * 1000; // 1 minute
  const limit = 100; // 100 requests per minute

  const record = rateLimitMap.get(ip);
  const now = Date.now();

  if (!record) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return true;
  }

  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
    return true;
  }

  if (record.count < limit) {
    record.count++;
    return true;
  }

  return false;
}

// --- 2. Auth Route Config ---
const protectedRoutes = [
  "/checkout",
  "/profile",
  "/orders",
  "/wishlist",
  "/address",
  "/change-password",
];

const guestRoutes = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const ip =
    (request as any).ip ||
    request.headers.get("x-forwarded-for") ||
    "127.0.0.1";

  // --- A. Rate Limiting ---
  if (!rateLimit(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // --- B. Authentication Redirection ---
  const token = request.cookies.get("token")?.value;
  let response: NextResponse | null = null;

  // If trying to access a protected route without a token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      response = NextResponse.redirect(loginUrl);
    }
  }

  // If trying to access a guest route with a token
  if (guestRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      response = NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If no redirection happened, proceed with the request
  if (!response) {
    response = NextResponse.next();
  }

  // --- C. Security Headers ---
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, lang, ngrok-skip-browser-warning",
  );

  // Only set Content-Type to JSON for API requests or if requested, to avoid breaking HTML pages
  if (
    pathname.startsWith("/api") ||
    request.headers.get("accept")?.includes("application/json")
  ) {
    response.headers.set("Content-Type", "application/json");
  }

  const csp = `
    default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
    script-src * 'unsafe-inline' 'unsafe-eval';
    style-src * 'unsafe-inline';
    img-src * data: blob:;
    font-src * data:;
    connect-src *;
    frame-src *;
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", csp);

  // --- D. CSRF Check ---
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        // Strict blocking would go here if needed
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

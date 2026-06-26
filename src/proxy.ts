import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_FALLBACK_PATH,
  canAccessPath,
  normalizeUserRole,
} from "@/lib/auth/permissions";

const LOGIN_PATH = "/auth/login";
const ASSESSMENT_PUBLIC_PATH = "/assessment/start";
const ADMIN_HOME_PATH = "/anggota-bmt";

const publicApiPrefixes = [
  "/api/auth",
  "/api/regions",
  "/api/hello",
  "/api/backend/assessment/validate-phone",
  "/api/backend/v1/keluarga/checkbyphone",
];

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

function isPublicRoute(pathname: string) {
  return pathname === LOGIN_PATH || pathname === ASSESSMENT_PUBLIC_PATH;
}

function isPublicApiRoute(pathname: string, method: string) {
  if (publicApiPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return (
    ((pathname === "/api/backend/assessment" ||
      pathname === "/api/backend/v1/assessment") &&
      method === "POST") ||
    (pathname === "/api/backend/v1/auth/keluarga" && method === "POST")
  );
}

function getAuthenticatedHome(role?: string | null) {
  return normalizeUserRole(role) === "user" ? ADMIN_HOME_PATH : "/";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (isPublicApiRoute(pathname, request.method)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isPublicRoute(pathname)) {
    if (token && pathname === LOGIN_PATH) {
      return NextResponse.redirect(
        new URL(getAuthenticatedHome(token.role), request.url),
      );
    }

    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  const role = normalizeUserRole(token.role);

  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL(ADMIN_FALLBACK_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/bmt/:path*",
    "/anggota-bmt/:path*",
    "/assessment/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/login",
    "/api/backend/:path*",
  ],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  appLocales,
  getPreferredLocale,
} from "./src/features/portfolio/i18n/routing";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = appLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

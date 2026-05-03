import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  defaultLocale,
  isAppLocale,
} from "./src/features/portfolio/i18n/routing";

function stripLocalePrefix(pathname: string) {
  const [, , ...rest] = pathname.split("/");
  const nextPathname = rest.join("/");

  return nextPathname ? `/${nextPathname}` : "/";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (firstSegment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = stripLocalePrefix(pathname);

    return NextResponse.redirect(url);
  }

  if (pathname !== "/" && !isAppLocale(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

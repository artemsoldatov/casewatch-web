import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("cw_token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/alerts") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/alerts", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/alerts/:path*", "/login"],
};

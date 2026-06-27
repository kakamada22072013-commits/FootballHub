import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/auth/dashboard", "/profile", "/favourites", "/settings"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("fh_token")?.value || 
    request.headers.get("authorization")?.replace("Bearer ", "") || "";
  const pathname = request.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup")) && token) {
    return NextResponse.redirect(new URL("/auth/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/dashboard/:path*",
    "/auth/login",
    "/auth/signup",
    "/profile/:path*",
    "/favourites/:path*",
    "/settings/:path*",
  ],
};

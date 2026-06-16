import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("smileos-session");
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/assets") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/services" ||
    pathname === "/treatments" ||
    pathname === "/doctors" ||
    pathname === "/insurance" ||
    pathname === "/financing" ||
    pathname === "/contact" ||
    pathname === "/book"
  ) {
    if (pathname === "/login" && sessionCookie && sessionCookie.value) {
      try {
        const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
        const user = JSON.parse(sessionStr);
        if (user.role === "PATIENT") {
          return NextResponse.redirect(new URL("/patient/dashboard", request.url));
        } else if (user.role === "DENTIST" || user.role === "ASSISTANT" || user.role === "RECEPTIONIST") {
          return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
        } else if (user.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      } catch (_) {
        // ignore
      }
    }
    return NextResponse.next();
  }

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const user = JSON.parse(sessionStr);

    if (pathname.startsWith("/patient") && user.role !== "PATIENT") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/doctor") && !["DENTIST", "ASSISTANT", "RECEPTIONIST"].includes(user.role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("smileos-session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/login",
  ],
};

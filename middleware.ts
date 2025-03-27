// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("admin-auth")?.value === "true";

  if (request.nextUrl.pathname.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Aplicar o middleware somente nessas rotas
export const config = {
  matcher: ["/admin/:path*"],
};

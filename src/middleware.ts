import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/usuario/perfil"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("auth_token");

  if (protectedRoutes.some((route) => url.pathname.startsWith(route)) && !token) {
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/usuario/:path*"],
};

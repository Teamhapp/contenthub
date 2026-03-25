import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (token?.isBanned) {
      return NextResponse.redirect(new URL("/auth/login?error=banned", req.url));
    }

    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/creator") && token?.role !== "creator" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const publicPaths = ["/", "/browse", "/auth", "/creator-profile"];
        if (publicPaths.some((p) => path === p || path.startsWith(p + "/"))) return true;
        if (path.startsWith("/api/auth")) return true;
        if (path.startsWith("/api/content") && req.method === "GET") return true;
        if (path.startsWith("/api/categories") && req.method === "GET") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|uploads|preview\\.html).*)",
  ],
};

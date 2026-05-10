import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If they are on a writer route but aren't a writer/admin
    if (path.startsWith("/dashboard/writer") && !["writer", "admin"].includes(token?.role as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If they are on a reader route but aren't a reader/admin
    if (path.startsWith("/dashboard/reader") && token?.role !== "reader" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If they are on an admin route but aren't an admin
    if (path.startsWith("/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/write/:path*",
    "/api/protected/:path*"
  ]
};
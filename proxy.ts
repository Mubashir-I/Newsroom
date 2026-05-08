import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (path.startsWith("/dashboard/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (path.startsWith("/dashboard/writer") && !["writer", "admin"].includes(token?.role as string)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        if (path.startsWith("/dashboard") && !token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*"]
};
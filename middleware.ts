import {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({req, token}) {
                const { pathname } = req.nextUrl;
                // Allow access to public routes
                if (
                    pathname.startsWith("/login") || 
                    pathname.startsWith("/register") || 
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/api/videos") ||
                    pathname.startsWith("/")
                ) {
                    return true;
                }

                return !!token; // only allow authenticated users
            },
        },
    }
)

export const config = {matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"]}    
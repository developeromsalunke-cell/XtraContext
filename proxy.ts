import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// 1. Specify public routes
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
];

const publicPrefixes = [
  "/dashboard/docs",
  "/api/auth",
];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Identify if it's a static asset or internal Next.js path
  const isStaticAsset = path.includes(".") || path.startsWith("/_next");
  if (isStaticAsset) {
    return NextResponse.next();
  }

  // 2. Check if the current route is public
  const isPublicRoute = publicRoutes.includes(path) || 
                       publicPrefixes.some(prefix => path.startsWith(prefix));

  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get("session")?.value;
  let session = null;
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      // Invalid session
    }
  }

  // 4. Redirect to /login if the user is not authenticated and trying to access a protected route
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated and trying to access login/signup
  if (
    session &&
    (path === "/login" || path === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  const response = NextResponse.next();
  
  // 6. Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

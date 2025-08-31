import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Skip authentication for these paths:
  // - /auth/callback (OAuth callback)
  // - /leaderboard (public leaderboard page)
  // - /api/ (all API routes - so they can be called without auth)
  const publicPaths = [
    "/auth/callback",
    "/leaderboard",
    "/api/"
  ];
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (!isPublicPath) {
    // Apply authentication for all other routes
    return await updateSession(request);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

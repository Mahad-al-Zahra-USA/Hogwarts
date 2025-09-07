// auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code"); // Extract the authorization code from the query params

  // Use the request origin for redirect (works for both localhost and production)
  const redirectURL = origin;

  console.log("Auth callback - Request URL:", request.url);
  console.log("Auth callback - Origin:", origin);
  console.log("Auth callback - Redirect URL:", redirectURL);

  if (code) {
    const supabase = await createClient(); // Await the `createClient` function since it's asynchronous
    const { error } = await supabase.auth.exchangeCodeForSession(code); // Exchange the code for a session

    if (error) {
      console.log("Auth error, redirecting to:", `${redirectURL}/auth/error`);
      return NextResponse.redirect(`${redirectURL}/auth/error`); // Use a safer way to redirect, avoiding `window.location`
    }
  }

  console.log("Auth success, redirecting to:", `${redirectURL}/`);
  return NextResponse.redirect(`${redirectURL}/`); // Redirect to the homepage of current origin
}

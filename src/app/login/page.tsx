// src/app/login/page.tsx
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export default function LoginPage() {
  // Initialize the Supabase client for the browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Redirect to the callback route
      },
    });

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    if (error) {
      console.error("Error logging in with Google:", error.message);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("User created at:", user?.created_at);
    console.log("User last sign-in at:", user?.last_sign_in_at);

    console.log("Google login response:", data);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center p-5 bg-white rounded shadow-sm">
        <h1 className="mb-4 display-4 text-primary">Welcome Back</h1>
        <p className="mb-4 text-muted">Please sign in to continue</p>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-lg btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={handleGoogleLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-google">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

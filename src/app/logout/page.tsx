"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  // Initialize the Supabase client for the browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push("/login");
    };

    handleLogout();
  }, [router, supabase]);

  return (
    <div className="text-center">
      <h1>Logging out...</h1>
    </div>
  );
}

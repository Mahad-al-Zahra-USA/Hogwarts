"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Check initial session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setIsAuthenticated(!!session);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) {
    // Show all links while loading to prevent layout shift
    return (
      <div className="navbar-nav ms-auto d-flex justify-content-start">
        <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/">
          Home
        </Link>
        <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/leaderboard">
          Leaderboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="navbar-nav ms-auto d-flex justify-content-start">
      <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/">
        Home
      </Link>
      {/* Only show Form link if user is authenticated */}
      {isAuthenticated && (
        <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/form">
          Form
        </Link>
      )}
      <Link className="nav-link fs-4 fs-sm-5 fs-md-6" href="/leaderboard">
        Leaderboard
      </Link>
    </div>
  );
} 
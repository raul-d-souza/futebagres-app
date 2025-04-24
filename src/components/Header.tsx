"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "global" });
    setSession(null);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-3">
      <Link href="/">
        <img
          src="/futeBagresLogoGold.png"
          alt="Logo"
          className="h-10 cursor-pointer"
        />
      </Link>
      <nav>
        {session ? (
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-700 font-medium hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 font-medium hover:underline"
            >
              Meu Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

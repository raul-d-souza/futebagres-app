"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Obtém sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuta mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-3">
      {/* Logo */}
      <Link href="/">
        <img src="/futeBagresLogoGold.png" alt="Logo" className="h-10 cursor-pointer" />
      </Link>

      {/* Navegação */}
      <nav>
        {session ? (
          <div className="flex items-center space-x-4">
            {/* Opções do usuário logado */}
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

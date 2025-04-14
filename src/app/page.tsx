"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Fundo verde com faixas horizontais */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#0b7a0b",
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.15) 0,
            rgba(255, 255, 255, 0.15) 4%,
            transparent 4%,
            transparent 8%
          )`,
          backgroundSize: "100% 40px",
        }}
      />

      {/* Borda branca em volta do campo (mais grossa) */}
      <div className="absolute inset-0 border-8 border-white pointer-events-none" />

      {/* Linha branca no meio do campo (mais grossa) */}
      <div className="absolute left-0 right-0 top-1/2 h-[4px] bg-white pointer-events-none" />

      {/* Círculo central com o Bagre dentro */}
      <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-8 border-white rounded-full pointer-events-none flex items-center justify-center">
        <img
          src="/futeBagresLogoWhite.png"
          alt="Logo FuteBagres"
          className="w-48 h-auto"
        />
      </div>

      {/* Texto e botão fixados perto do rodapé */}
      <div className="absolute bottom-16 w-full text-center flex flex-col items-center px-4">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
          Bem-vindo ao FuteBagres
        </h1>
        <p className="text-white text-sm md:text-lg mb-6 max-w-xl">
          Organize e gerencie seu futebol semanal de forma prática e moderna.
          Cadastre-se, participe de jogos e controle suas participações com
          facilidade!
        </p>
        <Link
          href="/auth"
          className="bg-white text-green-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
        >
          Entrar / Cadastro
        </Link>
      </div>
    </main>
  );
}

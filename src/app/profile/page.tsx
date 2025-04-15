"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

// Tipos para os dados do perfil e dos eventos
type Ratings = {
  passe: number;
  finalizacao: number;
  velocidade: number;
  defesa: number;
  condicionamento: number;
};

type ProfileData = {
  name: string;
  username: string;
  avatar_url: string;
  followers: number;
  following: number;
  ratings: Ratings;
};

type EventData = {
  id: number;
  title: string;
  description: string;
  date: string;
};

// Componente para exibição ou edição das estrelas (no nosso caso, apenas para exibir)
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={star <= rating ? "gold" : "none"}
          stroke="gold"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.48 3.499c.242-.733.793-.733 1.035 0l2.147 6.49a.613.613 0 00.581.422h6.723c.788 0 1.11 1.009.48 1.48l-5.456 3.963a.613.613 0 00-.221.685l2.086 6.537c.24.75-.198 1.198-.825.826l-5.416-3.4a.613.613 0 00-.66 0l-5.416 3.4c-.627.372-1.066-.076-.825-.826l2.086-6.537a.613.613 0 00-.221-.685l-5.456-3.963c-.63-.47-.308-1.48.48-1.48h6.724a.613.613 0 00.58-.422l2.148-6.49z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  // Estado para controlar a aba ativa: "overview", "eventos", ou "autoavaliacao"
  const [activeTab, setActiveTab] = useState<
    "overview" | "eventos" | "autoavaliacao"
  >("overview");

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth");
        return;
      }

      // Busca os dados do perfil na tabela "profiles"
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error.message);
      } else if (data) {
        setProfile({
          name:
            data.name ||
            data.full_name ||
            session.user.email ||
            "Usuário sem nome",
          username: data.username || session.user.email,
          avatar_url: data.avatar_url || "https://placehold.co/300x300",
          followers: data.followers || 0,
          following: data.following || 0,
          ratings: data.ratings || {
            passe: 0,
            finalizacao: 0,
            velocidade: 0,
            defesa: 0,
            condicionamento: 0,
          },
        });
      }

      // Opcional: Busca os eventos (caso tenha dados na tabela "events")
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*");
      if (eventsError) {
        console.error("Erro ao buscar eventos:", eventsError.message);
      } else if (eventsData) {
        setEvents(eventsData as EventData[]);
      }
    })();
  }, [router]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Fundo: Campo de futebol */}
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
      <div className="absolute inset-0 border-8 border-white pointer-events-none"></div>
      <div className="absolute left-0 right-0 top-1/2 h-[4px] bg-white pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-8 border-white rounded-full pointer-events-none flex items-center justify-center">
        <img
          src="/futeBagresLogoWhite.png"
          alt="Logo FuteBagres"
          className="w-24 h-auto"
        />
      </div>

      {/* Card para o Conteúdo */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg w-full max-w-6xl p-8">
          {/* Header do Card */}

          {/* Navegação das Abas */}
          <nav className="border-b border-gray-700 mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3 px-2 border-b-2 ${
                  activeTab === "overview"
                    ? "border-red-500 font-semibold text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-800 transition"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("eventos")}
                className={`py-3 px-2 border-b-2 ${
                  activeTab === "eventos"
                    ? "border-red-500 font-semibold text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-800 transition"
                }`}
              >
                Eventos
              </button>
              <button
                onClick={() => setActiveTab("autoavaliacao")}
                className={`py-3 px-2 border-b-2 ${
                  activeTab === "autoavaliacao"
                    ? "border-red-500 font-semibold text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-800 transition"
                }`}
              >
                Autoavaliação
              </button>
            </div>
          </nav>

          {/* Conteúdo Condicional */}
          {activeTab === "overview" && (
            <div className="flex flex-col md:flex-row md:space-x-8">
              {/* Coluna Esquerda: Foto e dados básicos */}
              <div className="md:w-1/3 flex flex-col items-center">
                <Image
                  src={profile.avatar_url}
                  alt="User avatar"
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-gray-900"
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {profile.name}
                </h2>
                <p className="text-gray-500">{profile.username}</p>
                <div className="mt-2 flex items-center text-sm">
                  <svg
                    className="mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  <span className="font-semibold">{profile.followers}</span>{" "}
                  followers
                  <span className="mx-1">·</span>
                  <span className="font-semibold">
                    {profile.following}
                  </span>{" "}
                  following
                </div>
              </div>
              {/* Coluna Direita: Informações gerais */}
              <div className="md:w-2/3 mt-6 md:mt-0">
                <h3 className="text-xl font-semibold text-gray-800">Sobre</h3>
                <p className="mt-2 text-gray-700">
                  Aqui você pode adicionar uma breve biografia, informações
                  sobre suas experiências ou detalhes gerais do seu perfil.
                </p>
                {/* Você pode adicionar outros detalhes conforme necessário */}
              </div>
            </div>
          )}

          {activeTab === "eventos" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-600">
                Eventos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.length > 0 ? (
                  events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 bg-gray-800 border border-gray-700 rounded-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-blue-400 font-semibold">
                          {evt.title}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                          Evento
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {evt.description}
                      </p>
                      <p className="text-xs text-gray-500">Data: {evt.date}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum evento cadastrado.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "autoavaliacao" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-600">
                Autoavaliação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.ratings &&
                  Object.entries(profile.ratings).map(([aspecto, valor]) => (
                    <div key={aspecto} className="flex items-center space-x-2">
                      <span className="capitalize text-gray-600 font-medium w-28">
                        {aspecto}:
                      </span>
                      <StarRating rating={valor} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

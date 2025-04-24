"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { EditProfileModal } from "@/components/EditProfileModal";

// Tipos
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
  description?: string;
};

type EventData = {
  id: number;
  title: string;
  description: string;
  date: string;
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${
            star <= rating ? "fill-yellow-400" : "fill-none"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 .587l3.668 7.431L24 9.75l-6 5.848 1.416 8.267L12 18.896l-7.416 4.969L6 15.598 0 9.75l8.332-1.732z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
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

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        const initialProfile: ProfileData = {
          name: data.name || "Usuário",
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
          description: data.description || "",
        };
        setProfile(initialProfile);
      }

      const { data: eventsData } = await supabase.from("events").select("*");
      if (eventsData) setEvents(eventsData);
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
    <main className="relative w-screen min-h-screen overflow-y-auto flex justify-center py-10 px-4">
      {/* Fundo */}
      <div className="absolute inset-0 bg-green-700" />
      <div className="absolute inset-0 border-8 border-white pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-8 border-white rounded-full pointer-events-none flex items-center justify-center">
        <img
          src="/futeBagresLogoWhite.png"
          alt="Logo"
          className="w-24 h-auto"
        />
      </div>

      {/* Card centralizado */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-6 border-b border-gray-700 w-full">
              {["overview", "eventos", "autoavaliacao"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-3 px-2 border-b-2 ${
                    activeTab === tab
                      ? "border-red-500 font-semibold text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-800 transition"
                  }`}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
            <EditProfileModal
              profile={profile}
              onSave={(data: any) => setProfile((prev) => ({ ...prev!, ...data }))}
            />
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="flex flex-col items-center">
                <Image
                  src={profile.avatar_url}
                  alt="Avatar"
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-gray-900"
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {profile.name}
                </h2>
                <p className="text-gray-500">{profile.username}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">{profile.followers}</span>{" "}
                  followers ·{" "}
                  <span className="font-semibold">{profile.following}</span>{" "}
                  following
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800">Sobre</h3>
                <p className="mt-2 text-gray-700">
                  {profile.description || "Nenhuma descrição adicionada ainda."}
                </p>
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
                {Object.entries(profile.ratings).map(([aspecto, valor]) => (
                  <div key={aspecto} className="flex items-center space-x-2">
                    <span className="capitalize text-gray-600 font-medium w-32">
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

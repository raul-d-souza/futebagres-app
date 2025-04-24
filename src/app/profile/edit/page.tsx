"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Ratings = {
  passe: number;
  finalizacao: number;
  velocidade: number;
  defesa: number;
  condicionamento: number;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [ratings, setRatings] = useState<Ratings>({
    passe: 0,
    finalizacao: 0,
    velocidade: 0,
    defesa: 0,
    condicionamento: 0,
  });

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setUserId(data.user_id);
        setName(data.name || "");
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || "");
        setRatings(
          data.ratings || {
            passe: 0,
            finalizacao: 0,
            velocidade: 0,
            defesa: 0,
            condicionamento: 0,
          }
        );
      } else {
        console.error("Erro ao buscar perfil:", error?.message);
      }

      setLoading(false);
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        username,
        avatar_url: avatarUrl,
        ratings,
      })
      .eq("user_id", userId);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Perfil atualizado com sucesso!");
      router.push("/profile");
    }
  };

  const handleRatingChange = (field: keyof Ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Carregando...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avatar (URL da imagem)
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Autoavaliação
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(ratings).map(([key, val]) => (
                <div key={key}>
                  <label className="capitalize text-sm text-gray-700 block">
                    {key}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={val}
                    onChange={(e) =>
                      handleRatingChange(
                        key as keyof Ratings,
                        Number(e.target.value)
                      )
                    }
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </main>
  );
}

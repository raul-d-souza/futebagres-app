"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import CreateEventModal from "@/components/CreateEventModal";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [ownedEvents, setOwnedEvents] = useState<any[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<any[]>([]);
  const [presenceDates, setPresenceDates] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.replace("/auth");
      setSession(session);

      fetchUserData(session.user.id);
    })();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    const { data: owned } = await supabase
      .from("events")
      .select("*")
      .eq("owner_id", userId);
    setOwnedEvents(owned || []);

    const { data: participating } = await supabase
      .from("event_participants")
      .select("event_id, events(*)")
      .eq("user_id", userId);
    const events = participating?.map((p: any) => p.events) || [];
    setParticipatingEvents(events);

    const { data: attendance, error } = await supabase
      .from("event_attendance")
      .select("attended_at")
      .eq("user_id", userId);

    if (error) console.error("Erro ao buscar presenças:", error);

    const dates = (attendance || []).map((a) =>
      format(new Date(a.attended_at), "yyyy-MM-dd")
    );
    setPresenceDates(dates);
  };

  const handleCreateEvent = async (eventData: any) => {
    if (!session) return;
    const { error } = await supabase.from("events").insert({
      ...eventData,
      owner_id: session.user.id,
    });

    if (!error) {
      fetchUserData(session.user.id);
      setModalOpen(false);
    } else {
      alert("Erro ao criar evento: " + error.message);
    }
  };

  const filteredOwned = ownedEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredParticipating = participatingEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 pt-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar eventos por nome ou código..."
            className="flex-1 p-2 rounded border border-gray-300 shadow-sm text-gray-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            Filtrar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Meus Eventos
              </h2>
              <button
                className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700"
                onClick={() => setModalOpen(true)}
              >
                Criar Evento
              </button>
            </div>
            {filteredOwned.length > 0 ? (
              <ul className="space-y-2">
                {filteredOwned.map((e) => (
                  <li key={e.id} className="text-gray-600 border-b pb-2">
                    <strong>{e.title}</strong>{" "}
                    <span className="text-xs text-gray-400">({e.code})</span>
                    <p className="text-sm">
                      {e.location} - {format(new Date(e.date), "dd/MM/yyyy")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum evento encontrado.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Eventos que Participo
            </h2>
            {filteredParticipating.length > 0 ? (
              <ul className="space-y-2">
                {filteredParticipating.map((e) => (
                  <li key={e.id} className="text-gray-600 border-b pb-2">
                    <strong>{e.title}</strong>{" "}
                    <span className="text-xs text-gray-400">({e.code})</span>
                    <p className="text-sm">
                      {e.location} - {format(new Date(e.date), "dd/MM/yyyy")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum evento encontrado.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Histórico de Presença
          </h2>
          <CalendarHeatmap presenceDates={presenceDates} />
        </div>
      </div>

      <CreateEventModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleCreateEvent} />
    </main>
  );
}

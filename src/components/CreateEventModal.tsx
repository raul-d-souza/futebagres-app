import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function CreateEventModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [maxGoalkeepers, setMaxGoalkeepers] = useState(2);
  const [fieldType, setFieldType] = useState("society");
  const [duration, setDuration] = useState(90);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("weekly");
  const [startTime, setStartTime] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [casualPrice, setCasualPrice] = useState(0);
  const [eventDate, setEventDate] = useState("");

  const handleSave = () => {
    // Converte "HH:mm" em minutos
    const [hour, minute] = startTime.split(":").map(Number);
    const startMinutes = hour * 60 + minute;

    const endMinutes = startMinutes + duration;
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMinute = endMinutes % 60;

    // Formata para "HH:mm"
    const end_time = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;

    // Função para gerar código aleatório de 6 caracteres
    const generateCode = () =>
      Math.random().toString(36).substring(2, 8).toUpperCase(); // Ex: "A1B2C3"

    const code = generateCode();

    onSave({
      title,
      location,
      is_private: isPrivate,
      max_players: maxPlayers,
      max_goalkeepers: maxGoalkeepers,
      field_type: fieldType,
      duration,
      is_recurring: isRecurring,
      recurrence,
      start_time: startTime,
      end_time,
      date: eventDate,
      price_monthly: monthlyPrice,
      price_casual: casualPrice,
      code, // 👈 agora com código aleatório
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-full max-w-xl z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              Novo Evento
            </Dialog.Title>
            <Dialog.Close asChild>
              <button>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </button>
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Título
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Data do evento
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded text-gray-800"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Localização
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-800"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Tipo
              </label>
              <select
                className="w-full p-2 border rounded text-gray-800"
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
              >
                <option value="society">Society</option>
                <option value="salao">Salão</option>
                <option value="campo">Campo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Duração (min)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded text-gray-800"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Máx. jogadores
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded text-gray-800"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Máx. goleiros
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded text-gray-800"
                value={maxGoalkeepers}
                onChange={(e) => setMaxGoalkeepers(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Horário de início
              </label>
              <input
                type="time"
                className="w-full p-2 border rounded text-gray-800"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Valor mensalista (R$)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded text-gray-800"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Valor avulso (R$)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded text-gray-800"
                value={casualPrice}
                onChange={(e) => setCasualPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2 text-gray-800">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span>Evento privado</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-800">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <span>Recorrente</span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700">
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Salvar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

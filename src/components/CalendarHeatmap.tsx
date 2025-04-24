// components/CalendarHeatmap.tsx
"use client";
import { format, subDays, addDays, isSameDay } from "date-fns";

type Props = {
  presenceDates: string[]; // datas em que o usuário marcou presença (yyyy-MM-dd)
};

export default function CalendarHeatmap({ presenceDates }: Props) {
  const today = new Date();
  const startDate = subDays(today, 15);
  const endDate = addDays(today, 15);

  const days: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return (
    <div className="mt-4 p-4">
      {/* Removido o título daqui */}
      <div className="flex gap-1 overflow-x-auto">
        {days.map((day, index) => {
          const isPresent = presenceDates.some((d) =>
            isSameDay(new Date(d), day)
          );
          const formatted = format(day, "dd/MM");
          return (
            <div key={index} className="flex flex-col items-center w-8">
              <span className="text-xs text-gray-500">{formatted}</span>
              <div
                className={`w-6 h-6 rounded ${
                  isPresent ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

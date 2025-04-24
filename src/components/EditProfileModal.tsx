"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

const StarRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (n: number) => void;
}) => {
  return (
    <div className="flex space-x-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => onRate(star)}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 ${
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

export function EditProfileModal({ profile, onSave }: any) {
  const [open, setOpen] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState(profile.avatar_url);
  const [description, setDescription] = useState(profile.description || "");
  const [ratings, setRatings] = useState<Record<string, number>>(
    profile.ratings
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarBase64,
        description,
        ratings,
      })
      .eq("user_id", session.user.id);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      onSave({ avatar_url: avatarBase64, description, ratings });
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="text-blue-600 hover:underline">
          ✏️ Editar Perfil
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              Editar Perfil
            </Dialog.Title>
            <Dialog.Close asChild>
              <button>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </button>
            </Dialog.Close>
          </div>

          {/* Avatar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto de perfil
            </label>
            <input
              type="file"
              className="text-gray-800"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {avatarBase64 && (
              <img
                src={avatarBase64}
                alt="Preview"
                className="mt-2 rounded-full w-24 h-24 object-cover border"
              />
            )}
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              className="w-full border rounded p-2 text-gray-800 placeholder-gray-400"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Autoavaliação */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Autoavaliação</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700 w-32">{key}</span>
                  <StarRating
                    rating={value}
                    onRate={(val) => handleRatingChange(key, val)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

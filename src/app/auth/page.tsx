"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) {
        setModalMessage(error.message);
        setIsModalOpen(true);
      } else {
        setModalMessage("Login realizado com sucesso!");
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } else {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password: senha,
          phone: telefone,
          options: {
            data: {
              full_name: nome,
            },
          },
        });

      if (signUpError) {
        setModalMessage(signUpError.message);
        setIsModalOpen(true);
      } else {
        // Cria linha na tabela profiles
        await supabase.from("profiles").insert([
          {
            user_id: signUpData.user?.id,
            name: nome,
            avatar_url: "",
            ratings: {
              passe: 0,
              finalizacao: 0,
              velocidade: 0,
              defesa: 0,
              condicionamento: 0,
            },
            description: "",
          },
        ]);

        setModalMessage("Cadastro realizado com sucesso! Faça login agora.");
        setIsModalOpen(true);
        setTimeout(() => {
          setModo("login");
          setIsModalOpen(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-gray-100">
      <img
        src="/GolPNG.png"
        alt="Gol de Futebol"
        className="absolute top-0 left-1/2 -translate-x-1/2 object-contain max-h-[80vh]"
        style={{ zIndex: 0, top: "100px" }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded shadow-md w-full max-w-md mx-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {modo === "login" ? "Fazer Login" : "Fazer Cadastro"}
        </h2>

        {modo === "cadastro" && (
          <>
            <label className="block text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              placeholder="João da Silva"
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label className="block text-gray-700 mb-2">Telefone</label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </>
        )}

        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-gray-700 mb-2">Senha</label>
        <input
          type="password"
          placeholder="Senha"
          className="border border-gray-300 p-2 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          {modo === "login" ? "Entrar" : "Cadastrar"}
        </button>

        <p className="text-center mt-4 text-gray-800">
          {modo === "login" ? "Novo por aqui?" : "Já tem conta?"}{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => setModo(modo === "login" ? "cadastro" : "login")}
          >
            {modo === "login" ? "Cadastre-se" : "Faça Login"}
          </span>
        </p>
      </form>

      {isModalOpen && (
        <div className="absolute z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <p className="text-gray-800">{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-indigo-600 text-white mt-4 px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

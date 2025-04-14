"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  // Campos do form
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  // Para alternar entre 'login' e 'cadastro'
  const [modo, setModo] = useState<"login" | "cadastro">("login");

  // Para mostrar Modal de feedback
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (modo === "login") {
      // LOGIN
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
        // Exemplo: redirecionar depois de 2s
        setTimeout(() => {
          router.push("/dashboard"); // ou onde quiser
        }, 2000);
      }
    } else {
      // CADASTRO
      // Vamos gravar o telefone em 'phone' e o nome em user_metadata
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        phone: telefone, // se quiser usar o campo phone nativo
        options: {
          data: {
            full_name: nome, // user_metadata.full_name
          },
        },
      });
      if (error) {
        setModalMessage(error.message);
        setIsModalOpen(true);
      } else {
        // Cadastro bem-sucedido
        setModalMessage("Cadastro realizado com sucesso! Faça login agora.");
        setIsModalOpen(true);
        // Redirecionar para login depois de alguns segundos
        setTimeout(() => {
          setModo("login");
          setIsModalOpen(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-gray-100">
      {/* IMAGEM DE FUNDO (Gol) - Ajuste se necessário */}
      <img
        src="/GolPNG.png"
        alt="Gol de Futebol"
        className="absolute top-0 left-1/2 -translate-x-1/2 object-contain max-h-[80vh]"
        style={{ zIndex: 0, top: "100px" }}
      />

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded shadow-md w-full max-w-md mx-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {modo === "login" ? "Fazer Login" : "Fazer Cadastro"}
        </h2>

        {/* Se for cadastro, exibir campos de Nome e Telefone */}
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

      {/* MODAL */}
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

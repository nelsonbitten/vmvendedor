// src/components/AgentMenus.tsx
"use client";

import React from "react";
import { agents } from "../utils/agents";
import { useNavigate } from "react-router-dom"; // ✅ importa o hook de navegação

interface AgentMenusProps {
  isDarkMode: boolean;
}

const AgentMenus: React.FC<AgentMenusProps> = ({ isDarkMode }) => {
  const navigate = useNavigate(); // ✅ instância do roteador

  const handleClick = (titulo: string) => {
    // redireciona para a rota com base no título
    switch (titulo) {
      case "Analista de Perfis do Instagram":
        navigate("/agente1");
        break;
      case "Criadora de Bio":
        navigate("/agente2");
        break;
      case "Especialista em Remarketing":
        navigate("/agente3");
        break;
      case "Especialista em Copy":
        navigate("/agente4");
        break;
    }
  };

  return (
    <div className="text-center mt-8">
      <div className="flex justify-center items-center mb-6">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-16 h-16 rounded-full object-contain bg-white dark:bg-gray-800 shadow"
        />
      </div>
      <p
        className={`text-lg font-medium ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        🚀 Acelere suas vendas com IA
      </p>
      <p
        className={`text-sm mb-6 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        A ferramenta inteligente feita para vendedores.
      </p>

      <div className="max-w-2xl mx-auto space-y-3">
        {agents.map(({ titulo, descricao, imagem, nome }, index) => (
          <button
            key={index}
            onClick={() => handleClick(titulo)} // ✅ aqui chama o redirecionamento
            className={`w-full p-4 rounded-xl border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                : "bg-white border-gray-200 hover:border-gray-300"
            } transition-all duration-200 group text-left flex items-start gap-3`}
          >
            <div className="flex items-center gap-3">
              <img
                src={imagem}
                alt={nome}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs whitespace-nowrap">
                    {nome}
                  </span>
                  <h3
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {titulo}
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {descricao}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgentMenus;

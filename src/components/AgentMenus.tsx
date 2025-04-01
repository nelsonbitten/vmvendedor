"use client";

import React from "react";
import { agents } from "../utils/agents";
import { useNavigate } from "react-router-dom";

interface AgentMenusProps {
  isDarkMode: boolean;
}

const AgentMenus: React.FC<AgentMenusProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const badgeColors: Record<string, string> = {
    Kora: "bg-green-100 text-green-800",
    Ayra: "bg-purple-100 text-purple-800",
    Luma: "bg-blue-100 text-blue-800",
    Sofi: "bg-yellow-100 text-yellow-800",
  };

  const handleClick = (titulo: string) => {
    // Redireciona para a página com o parâmetro 'titulo'
    switch (titulo) {
      case "Especialista em Legendas":
        navigate(`/agente1?titulo=legendas`); // ✅ correto
        break;
      case "Criadora de Bio":
        navigate(`/agente2?titulo=bio`);
        break;
      case "Especialista em Remarketing":
        navigate(`/agente3?titulo=remarketing`);
        break;
      case "Especialista em Copy":
        navigate(`/agente4?titulo=copywriting`);
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-3">
        {agents.map(({ titulo, descricao, imagem, nome }, index) => (
          <button
            key={index}
            onClick={() => handleClick(titulo)}
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
                  <span
                    className={`${
                      badgeColors[nome] || "bg-gray-200 text-gray-800"
                    } rounded-full px-2 py-1 text-xs whitespace-nowrap`}
                  >
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

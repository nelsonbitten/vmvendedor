import React, { useState } from "react";
import AgentHeader from "../components/AgentHeader";
import MessageList from "../components/MessageList";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "../types";

export default function Agente4Page() {
  const isDarkMode = false;
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div
      className={`min-h-screen max-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Cabeçalho fixo no topo com sticky */}
      <div
        className={`sticky top-0 z-10 p-4 backdrop-blur-md ${
          isDarkMode ? "bg-gray-900/80" : "bg-white/80"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all border mb-3 ${
              isDarkMode
                ? "bg-gray-800 text-teal-400 border-gray-700 hover:bg-gray-700"
                : "bg-white text-teal-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <span className="text-sm">←</span> Voltar
          </button>

          <AgentHeader
            nome="Sofi"
            especialidade="Especialista em Copy"
            descricao="Transformo ideias em palavras que vendem e engajam."
            imagem="/agente4.png"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Chat ocupando o restante da tela com rolagem */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <MessageList
            isDarkMode={isDarkMode}
            stepInicial="copywriting"
            messages={messages}
            onSendMessage={(msg) => setMessages((prev) => [...prev, msg])}
            isTyping={false}
            onBackToMenu={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
}

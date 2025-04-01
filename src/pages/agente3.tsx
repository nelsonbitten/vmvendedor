import React from "react";
import { ChatMessage } from "../types";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTADO

interface Agente3PageProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isDarkMode: boolean;
  onSendMessage: (text: string, image?: File) => void;
  onBackToMenu: () => void;
}

const Agente3Page: React.FC<Agente3PageProps> = ({
  messages,
  isTyping,
  isDarkMode,
  onSendMessage,
  onBackToMenu,
}) => {
  const navigate = useNavigate(); // ✅ hook de navegação

  return (
    <div className="flex flex-col h-full">
      {/* 🔙 Botão Voltar */}
      <div className="p-4">
        <button
          onClick={() => {
            onBackToMenu();
            navigate("/");
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-lg">←</span> Voltar
        </button>
      </div>

      {/* 📇 Card da agente */}
      <div className="p-4 pt-0">
        <div className="bg-blue-100 shadow-md p-4 rounded-xl flex items-center gap-4">
          <div className="relative">
            <img
              src="/agente3.webp"
              alt="Luma"
              className="w-14 h-14 rounded-full object-cover"
            />
            {/* Bolinha online piscando */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-ping z-10"></span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Luma</h2>
            <p className="text-sm text-green-600 font-medium">Online</p>
            <p className="text-sm text-gray-600">
              Crio mensagens estratégicas para manter leads engajados e prontos
              para a compra.
            </p>
          </div>
        </div>
      </div>

      {/* 💬 Lista de mensagens */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          isDarkMode={isDarkMode}
          onSendMessage={onSendMessage}
          onBackToMenu={onBackToMenu}
        />
      </div>

      {/* 📥 Campo de digitação */}
      <div className="p-4 border-t">
        <MessageInput isDarkMode={isDarkMode} onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default Agente3Page;

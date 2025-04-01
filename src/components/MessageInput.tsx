// src/components/MessageInput.tsx
import React, { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (text: string, image?: File) => void;
  isDarkMode: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isDarkMode,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log("📨 Enviando mensagem do input:", message); // ✅ DEBUG

    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className={`w-full px-4 py-3 rounded-lg border text-[15px] outline-none ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
        }`}
      />
      <button
        type="submit"
        className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 font-medium"
      >
        <Send className="w-4 h-4" />
        <span>Enviar</span>
      </button>
    </form>
  );
};

export default MessageInput;

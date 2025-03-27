import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDarkMode: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isDarkMode }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className={`flex-1 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500' 
            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500'
        } px-4 py-3 focus:outline-none focus:ring-2 text-[15px]`}
      />
      <button
        type="submit"
        className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2 font-medium"
      >
        <Send className="w-4 h-4" />
        <span>Enviar</span>
      </button>
    </form>
  );
}

export default MessageInput;
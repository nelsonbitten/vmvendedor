import React, { useState } from "react";
import { Send, Paperclip, Trash2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, image?: File) => void;
  isDarkMode: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isDarkMode,
}) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    onSendMessage(message, image || undefined);
    setMessage("");
    setImage(null);
    setPreviewUrl(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setImage(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center relative">
      {/* Botão de imagem */}
      <label
        htmlFor="imageUpload"
        className={`cursor-pointer p-2 rounded-lg border ${
          isDarkMode
            ? "border-gray-700 text-white hover:bg-gray-800"
            : "border-gray-300 text-gray-600 hover:bg-gray-100"
        } transition`}
        title="Enviar imagem"
      >
        <Paperclip className="w-5 h-5" />
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      {/* Campo de input com imagem embutida */}
      <div className="relative flex-1">
        {previewUrl && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-10 w-10 object-cover rounded-md border border-gray-300"
              />
              <button
                onClick={removeImage}
                type="button"
                className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 hover:bg-gray-800"
                title="Remover imagem"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className={`w-full ${
            previewUrl ? "pl-16" : "pl-4"
          } pr-4 py-3 rounded-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
          } focus:outline-none focus:ring-2 text-[15px]`}
        />
      </div>

      {/* Botão Enviar */}
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

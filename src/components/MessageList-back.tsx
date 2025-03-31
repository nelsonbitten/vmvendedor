import React, { useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { Bot, User, Copy, Check, MessageSquare } from "lucide-react";
import TypingAnimation from "./TypingAnimation";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isDarkMode: boolean;
  onSendMessage?: () => void;
}
const [remarketing, setRemarketing] = React.useState<any>(null);

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  isDarkMode,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(date).toLocaleTimeString([], options);
  };

  const formatDate = () => {
    const today = new Date();
    const weekDays = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const dayOfWeek = weekDays[today.getDay()];
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return `${dayOfWeek} (${today.toLocaleDateString("pt-BR", options)})`;
  };

  const showSimButton = (message: ChatMessage) => {
    return (
      message.sender === "ai" &&
      (message.text.includes("Gostaria que eu enviasse o remarketing do dia") ||
        message.text.includes(
          "Gostaria de ver o segundo remarketing do dia"
        )) &&
      !message.image
    );
  };

  const handleNewButtonClick = () => {
    alert("Olá! Tudo bem?");
  };
  const handleFetchRemarketing = async () => {
    console.log("Função handleFetchRemarketing foi chamada!"); // Log para testar se a função foi chamada

    try {
      const response = await fetch("URL_DO_SEU_BACKEND"); // Substitua com a URL do seu backend
      const data = await response.json(); // Obtém os dados do backend

      if (response.ok) {
        console.log("Remarketing do dia recebido:", data); // Exibe os dados recebidos
        setRemarketing(data); // Armazena os dados no estado
      } else {
        console.error("Erro ao buscar remarketing do dia");
      }
    } catch (error) {
      console.error("Erro de rede:", error); // Em caso de erro na requisição
    }
  };

  return (
    <div
      className={`relative overflow-y-auto p-4 space-y-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {messages.length === 0 && (
        <div
          className={`text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } mt-8`}
        >
          <Bot
            className={`w-12 h-12 mx-auto mb-4 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <p
            className={`text-lg font-medium mb-6 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            🚀 Post e Remarketing diário
          </p>

          <div className="max-w-2xl mx-auto space-y-3">
            <button
              onClick={handleFetchRemarketing} // Altere para 'handleFetchRemarketing'
              className={`w-full p-4 rounded-xl border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                  : "bg-white border-gray-200 hover:border-gray-300"
              } transition-all duration-200 group text-left flex items-start gap-3`}
            >
              <MessageSquare
                className={`w-5 h-5 mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <div>
                <h3
                  className={`font-medium mb-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Remarketing de Hoje - {formatDate()}
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Clique aqui
                </p>
              </div>
            </button>

            <button
              onClick={handleNewButtonClick}
              className={`w-full p-4 rounded-xl border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                  : "bg-white border-gray-200 hover:border-gray-300"
              } transition-all duration-200 group text-left flex items-start gap-3`}
            >
              <MessageSquare
                className={`w-5 h-5 mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <div>
                <h3
                  className={`font-medium mb-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Novo Botão
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Clique aqui
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.sender === "ai" && (
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div className="relative group max-w-[80%]">
            <div
              className={`rounded-lg p-4 ${
                message.sender === "user"
                  ? isDarkMode
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "bg-gray-100 text-gray-800"
                  : isDarkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-[#f7f7f8] text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap pr-8">
                {message.text}
              </p>

              {showSimButton(message) && (
                <div className="mt-3">
                  <button
                    onClick={onSendMessage}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      isDarkMode
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    } transition-colors`}
                  >
                    Sim
                  </button>
                </div>
              )}

              {message.image && (
                <div className="mt-3">
                  <img
                    src={message.image}
                    alt="Remarketing do dia"
                    className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(message.image, "_blank")}
                  />
                  <div className="mt-2">
                    <a
                      href={message.image}
                      download="remarketing.jpg"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium ${
                        isDarkMode
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      ⬇️ Baixar imagem
                    </a>
                  </div>
                </div>
              )}

              <span
                className={`text-[11px] sm:text-xs mt-2 block ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>

              <button
                onClick={() => handleCopy(message.text, message.id)}
                className={`absolute top-2 right-2 p-1.5 rounded-md transition-opacity ${
                  copiedId === message.id
                    ? "opacity-100 bg-green-500 text-white"
                    : `opacity-0 group-hover:opacity-100 ${
                        isDarkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                      }`
                }`}
                title="Copiar mensagem"
              >
                {copiedId === message.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {message.sender === "user" && (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div
            className={`rounded-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-[#f7f7f8] border border-gray-200"
            }`}
          >
            <TypingAnimation isDarkMode={isDarkMode} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

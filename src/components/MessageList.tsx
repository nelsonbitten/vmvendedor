import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types";
import {
  Bot,
  User,
  Copy,
  Check,
  BadgeHelp,
  BookText,
  Repeat,
  Megaphone,
} from "lucide-react";
import TypingAnimation from "./TypingAnimation";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isDarkMode: boolean;
  onSendMessage?: (message: ChatMessage) => void;
  onBackToMenu?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  isDarkMode,
  onSendMessage,
  onBackToMenu,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 🔗 Envia mensagem para a função da OpenAI
  const sendMessageToAI = async (text: string) => {
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (res.ok) {
        return data.reply;
      } else {
        console.error("Erro da IA:", data.error);
        return "Desculpe, ocorreu um erro ao gerar a resposta.";
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      return "Não foi possível se comunicar com a IA.";
    }
  };

  // ✉️ Quando o usuário clica num botão do menu
  const handleMenuClick = async (titulo: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: `Quero ajuda com ${titulo}`,
      sender: "user",
      timestamp: new Date(),
    };

    onSendMessage?.(userMessage);

    const aiReply = await sendMessageToAI(userMessage.text);

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      text: aiReply,
      sender: "ai",
      timestamp: new Date(),
    };

    onSendMessage?.(aiMessage);
  };

  const menus = [
    {
      titulo: "Análise de Perfil",
      descricao:
        "Receba sugestões com base no seu perfil profissional ou de marca.",
      icone: BadgeHelp,
    },
    {
      titulo: "Gerador de Bio",
      descricao:
        "Crie uma biografia curta e eficaz para redes sociais ou sites.",
      icone: BookText,
    },
    {
      titulo: "Gerador de Remarketing",
      descricao: "Gere textos estratégicos para reconquistar seus visitantes.",
      icone: Repeat,
    },
    {
      titulo: "Gerador de Copy",
      descricao:
        "Obtenha textos persuasivos para vender seu produto ou serviço.",
      icone: Megaphone,
    },
  ];

  return (
    <div
      className={`absolute inset-0 overflow-y-auto p-4 space-y-4 overscroll-none ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {messages.length > 0 && (
        <div className="mb-2">
          <button
            onClick={onBackToMenu}
            className={`text-sm underline font-medium ${
              isDarkMode ? "text-teal-400" : "text-teal-700"
            } hover:opacity-80`}
          >
            ← Voltar ao menu inicial
          </button>
        </div>
      )}

      {messages.length === 0 && (
        <div
          className={`text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } mt-8`}
        >
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
            {menus.map(({ titulo, descricao, icone: Icon }, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(titulo)}
                className={`w-full p-4 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                } transition-all duration-200 group text-left flex items-start gap-3`}
              >
                <Icon
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
                    {titulo}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {descricao}
                  </p>
                </div>
              </button>
            ))}
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
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-7 h-7 rounded-full object-contain"
              />
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

              {message.image && (
                <div className="mt-3">
                  <img
                    src={message.image}
                    alt="Imagem"
                    className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(message.image, "_blank")}
                  />
                  <div className="mt-2">
                    <a
                      href={message.image}
                      download="imagem.jpg"
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

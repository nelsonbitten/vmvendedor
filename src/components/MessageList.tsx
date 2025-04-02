"use client";

import React, { useEffect, useRef } from "react";
import { User, Bot, Copy, Check } from "lucide-react";
import { ChatMessage } from "../types";
import AgentMenus from "./AgentMenus";
import TypingAnimation from "./TypingAnimation";
import { useChatFlow } from "../hooks/useChatFlow";
import { useLocation } from "react-router-dom";

interface MessageListProps {
  isDarkMode: boolean;
  stepInicial?: "analise_perfil" | "bio" | "remarketing" | "copywriting";
  messages: ChatMessage[];
  onSendMessage: (message: ChatMessage) => void;
  isTyping: boolean;
  onBackToMenu: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  isDarkMode,
  stepInicial,
  messages,
  onSendMessage,
  isTyping,
  onBackToMenu,
}) => {
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  // ✅ Função adaptadora para permitir ChatMessage → string
  const handleSendMessage = (message: ChatMessage) => {
    onSendMessage(message); // passa o objeto completo
  };

  const { step, handleMenuClick } = useChatFlow(handleSendMessage, stepInicial);

  // ✅ Log do fluxo atual
  console.log("📍 Fluxo atual (step):", step);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <div
      className={`relative overflow-y-auto px-6 sm:px-10 py-4 space-y-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* ✅ MOSTRA MENU SÓ NA HOME "/" */}
      {location.pathname === "/" &&
        !step &&
        messages.length === 0 &&
        !stepInicial && (
          <AgentMenus onSelectAgent={handleMenuClick} isDarkMode={isDarkMode} />
        )}

      {/* Lista de mensagens */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.sender === "ai" && (
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
              <img
                src="/logo.png"
                alt="IA"
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
              <span
                className={`text-[11px] block mt-2 ${
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
                title="Copiar"
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
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}

      {/* Animação de digitando */}
      {isTyping && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
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

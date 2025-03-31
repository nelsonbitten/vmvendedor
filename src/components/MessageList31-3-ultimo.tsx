"use client";

import React, { useEffect, useRef, useState } from "react";
import { User, Bot, Copy, Check } from "lucide-react";
import { ChatMessage } from "../types";
import AgentMenus from "./AgentMenus";
import TypingAnimation from "./TypingAnimation";
import { useChatFlow } from "../hooks/useChatFlow";

interface MessageListProps {
  isDarkMode: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ isDarkMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { handleMenuClick, handleUserMessage } = useChatFlow((message) => {
    setMessages((prev) => [...prev, message]);
  });

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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setIsTyping(true);
    await handleUserMessage(text);
    setIsTyping(false);
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <div
      className={`absolute inset-0 overflow-y-auto p-4 space-y-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {messages.length === 0 ? (
        <AgentMenus onSelectAgent={handleMenuClick} isDarkMode={isDarkMode} />
      ) : (
        <button
          onClick={() => setMessages([])}
          className={`text-sm underline font-medium ${
            isDarkMode ? "text-teal-400" : "text-teal-700"
          } hover:opacity-80`}
        >
          ← Voltar ao menu inicial
        </button>
      )}

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

      <div
        className={`mt-4 border-t pt-4 ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem(
              "userInput"
            ) as HTMLInputElement;
            const value = input.value.trim();
            if (value) {
              handleSend(value);
              input.value = "";
            }
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            name="userInput"
            placeholder="Digite sua mensagem..."
            className={`flex-1 px-4 py-2 rounded-lg border text-sm outline-none ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-800 border-gray-300 placeholder-gray-500"
            }`}
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageList;

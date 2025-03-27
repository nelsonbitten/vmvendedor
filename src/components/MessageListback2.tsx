
import React, { useEffect, useRef } from "react";
import { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
  isDarkMode: boolean;
  onSendMessage: (text: string) => void;
}

const MessageList: React.FC<Props> = ({
  messages,
  isTyping,
  isDarkMode,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`rounded-lg p-3 max-w-[70%] whitespace-pre-line ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {message.text}
            {message.image && (
              <img
                src={message.image}
                alt="Conteúdo visual"
                className="mt-2 rounded-lg max-w-full"
              />
            )}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div
            className={`rounded-lg p-3 max-w-[70%] ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Digitando...
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

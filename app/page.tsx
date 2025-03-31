"use client";

import React, { useState, useEffect } from "react";
import { Download, Settings, Moon, Sun } from "lucide-react";
import { ChatMessage } from "../types";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import Link from "next/link";

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleBackToMenu = () => {
    setMessages([]);
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } overscroll-none`}
    >
      <header
        className={`${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        } border-b p-4 flex-none`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              } flex items-center gap-2`}
            >
              NexOS
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
                title={isDarkMode ? "Modo claro" : "Modo escuro"}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <Link
                href="/admin/painel"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
                title="Abrir Admin"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="md:hidden flex items-center gap-1 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Instalar App
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden max-w-4xl w-full mx-auto relative">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          isDarkMode={isDarkMode}
          onSendMessage={(message) => setMessages((prev) => [...prev, message])}
          onBackToMenu={handleBackToMenu}
        />
      </main>

      <div
        className={`border-t ${
          isDarkMode
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-white"
        } flex-none`}
      >
        <div className="max-w-4xl mx-auto p-4">
          <MessageInput
            onSendMessage={(text) => {
              const userMessage: ChatMessage = {
                id: Date.now(),
                text,
                sender: "user",
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, userMessage]);
            }}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}

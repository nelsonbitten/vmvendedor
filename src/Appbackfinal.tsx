import React, { useState, useEffect } from "react";
import {
  Send,
  MessageSquare,
  Download,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { ChatMessage } from "./types";
import MessageList from "./components/MessageListbackfinal";
import ProgressBar from "./components/ProgressBar";
import MessageInput from "./components/MessageInput";
import AdminPanel from "./admin/AdminPanel";

import Login from "./pages/Login";
import Admin from "./pages/Admin";

import { Routes, Route } from "react-router-dom";

function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const MAX_MESSAGES = 1000;

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

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Aqui futuramente será chamada uma API real
    setIsTyping(false);
  };

  const handleRemarketing = () => {
    // Aqui futuramente será carregado o conteúdo do banco de dados
    console.log("Clique em 'Remarketing de Hoje'");
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
              <MessageSquare
                className={`w-6 h-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
              Vender Maquininha
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
              <button
                onClick={() => setShowAdminPanel(true)}
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
                title="Configurações"
              >
                <Settings className="w-5 h-5" />
              </button>
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
          <ProgressBar
            current={messages.length}
            max={MAX_MESSAGES}
            isDarkMode={isDarkMode}
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden max-w-4xl w-full mx-auto relative">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          isDarkMode={isDarkMode}
          onSendMessage={handleRemarketing}
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
            onSendMessage={handleSendMessage}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

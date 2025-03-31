// src/App.tsx
import React, { useState, useEffect } from "react";
import { Download, Moon, Sun } from "lucide-react";
import { ChatMessage } from "./types";
import MessageList from "./components/MessageList31-03-final";
import MessageInput from "./components/MessageInput";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminPanel from "./admin/AdminPanel";
import Agente1Page from "./pages/agente1";
import Agente2Page from "./pages/agente2";
import Agente3Page from "./pages/agente3";
import Agente4Page from "./pages/agente4";
import AgentMenus from "./components/AgentMenus"; // ✅ importa os menus

import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useLocation } from "react-router-dom";

function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 👇 AQUI! Pega a URL atual
  const location = useLocation();

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

  const handleSendMessage = (text: string, image?: File) => {
    if (!text.trim() && !image) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
      image: image ? URL.createObjectURL(image) : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
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
        <div className="w-full flex items-center justify-between">
          <h1
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            NexOS
          </h1>

          <div className="flex items-center gap-3">
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
      </header>

      <main className="flex-1 overflow-hidden max-w-4xl w-full mx-auto relative">
        <Routes>
          <Route
            path="/"
            element={
              messages.length === 0 ? (
                <AgentMenus isDarkMode={isDarkMode} />
              ) : (
                <MessageList
                  messages={messages}
                  isTyping={isTyping}
                  isDarkMode={isDarkMode}
                  onSendMessage={(message) =>
                    setMessages((prev) => [...prev, message])
                  }
                  onBackToMenu={handleBackToMenu}
                />
              )
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/admin/painel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/agente1" element={<Agente1Page />} />
          <Route path="/agente2" element={<Agente2Page />} />
          <Route path="/agente3" element={<Agente3Page />} />
          <Route path="/agente4" element={<Agente4Page />} />
        </Routes>
      </main>

      <div
        className={`border-t ${
          isDarkMode
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-white"
        } flex-none`}
      >
        <div className="max-w-4xl mx-auto p-4">
          {location.pathname.startsWith("/agente") && (
            <MessageInput
              isDarkMode={isDarkMode}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;

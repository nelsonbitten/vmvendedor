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
import AgentMenus from "./components/AgentMenus";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useLocation } from "react-router-dom";
import { useChatFlow } from "./hooks/useChatFlow";

function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const location = useLocation();

  const { step, setStep, handleMenuClick, handleUserMessage } = useChatFlow(
    (message) => {
      setMessages((prev) => [...prev, message]);
    }
  );

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

  const handleSendMessage = (input: string | ChatMessage, image?: File) => {
    const text = typeof input === "string" ? input : input.text;

    // ✅ Evita mensagens vazias
    if (!text.trim() && !image) return;

    // ✅ Só chama o fluxo se for texto puro
    if (typeof input === "string") {
      handleUserMessage(text); // 🔥 isso já adiciona a mensagem e chama a IA
    }
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
                  onSendMessage={handleSendMessage}
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

          {/* ✅ Agentes com stepInicial configurado */}
          <Route
            path="/agente1"
            element={
              <Agente1Page
                stepInicial="legendas" // ✅ Agora Kora se comporta como especialista em legendas
                messages={messages}
                isTyping={isTyping}
                isDarkMode={isDarkMode}
                onSendMessage={handleSendMessage}
                onBackToMenu={handleBackToMenu}
              />
            }
          />

          <Route
            path="/agente2"
            element={
              <Agente2Page
                messages={messages}
                isTyping={isTyping}
                isDarkMode={isDarkMode}
                onSendMessage={handleSendMessage}
                onBackToMenu={handleBackToMenu}
                stepInicial="bio"
              />
            }
          />

          <Route
            path="/agente3"
            element={
              <Agente3Page
                messages={messages}
                isTyping={isTyping}
                isDarkMode={isDarkMode}
                onSendMessage={handleSendMessage}
                onBackToMenu={handleBackToMenu}
                stepInicial="remarketing"
              />
            }
          />

          <Route
            path="/agente4"
            element={
              <Agente4Page
                messages={messages}
                isTyping={isTyping}
                isDarkMode={isDarkMode}
                onSendMessage={handleSendMessage}
                onBackToMenu={handleBackToMenu}
                stepInicial="copywriting"
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default ChatApp;

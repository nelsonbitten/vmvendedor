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
import MessageList from "./components/MessageList";
import ProgressBar from "./components/ProgressBar";
import MessageInput from "./components/MessageInput";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminPanel from "./admin/AdminPanel";
import { Routes, Route, Link } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import ProtectedRoute from "./components/ProtectedRoute";

function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
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

  const fetchConteudoDoDia = async (tipo: "remarketing" | "post") => {
    setIsTyping(true);
    const today = new Date().toISOString().split("T")[0];

    const { data: conteudo, error } = await supabase
      .from("conteudos")
      .select("*")
      .eq("type", tipo)
      .eq("date", today)
      .limit(1)
      .single();

    setIsTyping(false);

    if (error || !conteudo) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `Não encontrei ${tipo} para hoje (${today}).`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const novaMensagem: ChatMessage = {
      id: Date.now(),
      text: conteudo.text,
      sender: "ai",
      timestamp: new Date(),
      image: conteudo.image || undefined,
    };

    setMessages((prev) => [...prev, novaMensagem]);
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
    setIsTyping(false);
  };

  const handleRemarketing = () => {
    fetchConteudoDoDia("remarketing");
  };

  const handlePost = () => {
    fetchConteudoDoDia("post");
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } overscroll-none`}
    >
      <header
        className={`$${
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
              <img
                src="/logo.png"
                alt="Logo"
                className="w-9 h-9 rounded-full object-contain bg-white dark:bg-gray-800 shadow"
              />
              Vender Maquininha
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`$${
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
              {/*
  Para reativar o botão de engrenagem (abrir admin), descomente este bloco.
*/}

              {/* 
<Link
  to="/admin/painel"
  className={`${
    isDarkMode
      ? "text-gray-300 hover:text-white"
      : "text-gray-600 hover:text-gray-800"
  } transition-colors`}
  title="Abrir Admin"
>
  <Settings className="w-5 h-5" />
</Link> 
*/}

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
          {/*
  Para reativar a barra de progresso de mensagens, descomente este bloco.
  Isso mostrará o número de mensagens atuais comparado ao limite.
*/}

          {/* 
<ProgressBar
  current={messages.length}
  max={MAX_MESSAGES}
  isDarkMode={isDarkMode}
/> 
*/}
        </div>
      </header>

      <main className="flex-1 overflow-hidden max-w-4xl w-full mx-auto relative">
        <div className="flex flex-col md:flex-row gap-4 px-4 py-6">
          <button
            onClick={handleRemarketing}
            className="flex-1 bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-opacity-90 transition"
          >
            Remarketing de Hoje
            <div className="text-sm font-normal">Clique aqui</div>
          </button>
          <button
            onClick={handlePost}
            className="flex-1 bg-white text-black border border-black px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            Post de Hoje
            <div className="text-sm font-normal">Clique aqui</div>
          </button>
        </div>

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
        {/* 
        Para reativar o envio de mensagens, descomente o bloco abaixo.
        Isso exibirá o input no rodapé do chat novamente.
      */}
        {/* 
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
      */}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
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
    </Routes>
  );
}

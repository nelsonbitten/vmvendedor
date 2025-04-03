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
  const [remarketing2Sent, setRemarketing2Sent] = useState(false);
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

  const formatDate = () => {
    const today = new Date();
    const weekDays = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
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

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        text: remarketing2Sent
          ? `No momento posso enviar apenas Remarketing. Gostaria que eu enviasse o remarketing do dia (${formatDate()})?`
          : `Posso gerar 2 remarketings por dia. Gostaria de ver o segundo remarketing do dia (${formatDate()})?`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 500);
  };

  const handleRemarketing = () => {
    const remarketing = remarketing2Sent
      ? {
          id: Date.now(),
          text: `⚡ VENDEU HOJE, RECEBEU HOJE! E COM 65% DE DESCONTO! 🚀
Se você busca economia de verdade, acabou de encontrar: a Ton tá dando até 65% de desconto na maquininha + taxas INCRÍVEIS no plano Ton Pro:
✔ Débito: 0,74%
✔ Crédito: 0,74%
✔ Em 12x: 8,99%
E o melhor? Recebe no mesmo dia! 💸
Ou seja, mais lucro, mais agilidade e sem dor de cabeça!

⏳ Promo válida por pouco tempo!`,
          sender: "ai",
          timestamp: new Date(),
          image: "https://i.ibb.co/KpYtdFXv/2.png",
        }
      : {
          id: Date.now(),
          text: `📣 VOCÊ FOI ESCOLHIDO! ATÉ 65% DE DESCONTO NA TON! 💳
Hoje é o dia de dar um passo gigante no seu negócio: você acaba de liberar até 65% de desconto na sua maquininha Ton!
Essa condição é exclusiva, por tempo limitadíssimo e pode acabar a qualquer momento! 😱
💡 Mesmo com esse descontão, a qualidade da Ton continua sendo a melhor do mercado – tecnologia de ponta, sem aluguel e com suporte top!

✅ Aproveite enquanto ainda tem unidade disponível!`,
          sender: "ai",
          timestamp: new Date(),
          image: "https://i.ibb.co/Jjq8xh5X/1.png",
        };

    setMessages((prev) => [...prev, remarketing]);

    if (!remarketing2Sent) {
      setTimeout(() => {
        const followUpMessage: ChatMessage = {
          id: Date.now() + 2,
          text: `Posso gerar 2 remarketings por dia. Gostaria de ver o segundo remarketing do dia (${formatDate()})?`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, followUpMessage]);
      }, 1000);
      setRemarketing2Sent(true);
    }
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

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCopy, FaCheck } from "react-icons/fa6";
import { ChatMessage } from "../types";
import legendaList from "../data/legendaList";

const Agente1Page: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ultimaEntradaValida, setUltimaEntradaValida] = useState<string | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mensagemInicial: ChatMessage = {
      id: Date.now(),
      text: "Oi! 😊 Clica no botão abaixo para gerar as legendas.",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([mensagemInicial]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (entradaUsuario: string) => {
    const textoLimpo = entradaUsuario.trim().toLowerCase();
    const pedidoNovaVersao = [
      "quero outra",
      "outra",
      "mais uma",
      "manda outra",
    ];

    const userText =
      pedidoNovaVersao.includes(textoLimpo) && ultimaEntradaValida
        ? ultimaEntradaValida
        : entradaUsuario;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: entradaUsuario,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    if (!pedidoNovaVersao.includes(textoLimpo)) {
      setUltimaEntradaValida(userText);
    }

    const sugestoes = legendaList[userText.toLowerCase()];

    if (!sugestoes || sugestoes.length === 0) {
      setTimeout(() => {
        const mensagemErro: ChatMessage = {
          id: Date.now() + 1,
          text: "Ainda não tenho legendas prontas para esse conteúdo. Pode me dar mais detalhes ou tente outro tema!",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, mensagemErro]);
        setIsTyping(false);
      }, 3000);
      return;
    }

    const index = Math.floor(Math.random() * sugestoes.length);
    const resposta = sugestoes[index];

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 2,
        text: resposta,
        sender: "ai",
        timestamp: new Date(),
      };

      const followUp: ChatMessage = {
        id: Date.now() + 3,
        text: "Se quiser outra legenda, é só clicar no botão abaixo 💬",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage, followUp]);
      setIsTyping(false);
    }, 3000);
  };

  const handleCopyMessage = (messageText: string, messageId: number) => {
    navigator.clipboard.writeText(messageText).then(() => {
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const isCopyable = (message: ChatMessage) => {
    return (
      message.sender === "ai" &&
      !message.text.toLowerCase().startsWith("se quiser outra")
    );
  };

  const handleGenerateLegenda = () => {
    const textoGerado = "legenda";
    handleSendMessage(textoGerado);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-lg">←</span> Voltar
        </button>
      </div>

      <div className="p-4 pt-0">
        <div className="bg-green-100 shadow-md p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <img
              src="/agente1.webp"
              alt="Kora"
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-ping z-10"></span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Kora | Geradora de Legendas
            </h2>
            <p className="text-xs sm:text-sm text-green-600 font-medium">
              Online
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-20 sm:pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                <img
                  src="/agente1.webp"
                  alt="Kora"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>
            )}
            <div className="relative group max-w-[80%]">
              <div
                className={`rounded-lg p-4 border text-sm whitespace-pre-wrap ${
                  message.sender === "user"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-[#e9fbe9] text-gray-800 border-gray-200"
                }`}
              >
                <p
                  className="pr-8"
                  dangerouslySetInnerHTML={{ __html: message.text }}
                ></p>

                {isCopyable(message) && (
                  <button
                    onClick={() => handleCopyMessage(message.text, message.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                    title="Copiar"
                  >
                    {copiedId === message.id ? (
                      <FaCheck className="w-3.5 h-3.5" />
                    ) : (
                      <FaRegCopy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            {message.sender === "user" && (
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-[10px] font-semibold">
                EU
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 pl-4 mb-4">
            Kora está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 sm:static fixed bottom-3 w-full max-w-[100vw] z-50">
        <button
          onClick={handleGenerateLegenda}
          className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-base sm:text-lg font-semibold"
        >
          Gerar Legenda
        </button>
      </div>
    </div>
  );
};

export default Agente1Page;

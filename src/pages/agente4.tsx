import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";
import { ChatMessage } from "../types";
import copyList from "../data/copyList";

const Agente4Page: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ultimaEntradaValida, setUltimaEntradaValida] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mensagemInicial: ChatMessage = {
      id: Date.now(),
      text: "Oi! 😊 Clica no botão abaixo para gerar a copy do seu anúncio.",
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

    const sugestoes = copyList[userText.toLowerCase()];

    if (!sugestoes || sugestoes.length === 0) {
      const mensagemErro: ChatMessage = {
        id: Date.now() + 1,
        text: "Ainda não tenho copys prontas para esse tipo de anúncio. Pode me dar mais detalhes ou tente outro tema!",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mensagemErro]);
      setIsTyping(false);
      return;
    }

    const index = Math.floor(Math.random() * sugestoes.length);
    const resposta = sugestoes[index];

    const aiMessage: ChatMessage = {
      id: Date.now() + 2,
      text: resposta,
      sender: "ai",
      timestamp: new Date(),
    };

    const followUp: ChatMessage = {
      id: Date.now() + 3,
      text: "Se quiser ajustar ou criar outra versão, é só clicar no botão abaixo 💬",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage, followUp]);
    setIsTyping(false);
  };

  const handleCopyMessage = (messageText: string) => {
    navigator.clipboard.writeText(messageText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGenerateCopy = () => {
    const textoGerado = "copy";
    handleSendMessage(textoGerado);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-lg">←</span> Voltar
        </button>
      </div>

      <div className="p-4 pt-0">
        <div className="bg-yellow-100 shadow-md p-4 rounded-xl flex items-center gap-4">
          <div className="relative">
            <img
              src="/agente4.webp"
              alt="Sofi"
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-ping z-10"></span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Sofi | Copywriter de Anúncios
            </h2>
            <p className="text-sm text-green-600 font-medium">Online</p>
            <p className="text-sm text-gray-600">
              Transformo ideias em palavras que vendem ✨
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-4">
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
                  src="/agente4.webp"
                  alt="Sofi"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>
            )}
            <div className="relative group max-w-[80%]">
              <div
                className={`rounded-lg p-4 border text-sm whitespace-pre-wrap ${
                  message.sender === "user"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-[#f7f7f8] text-gray-800 border-gray-200"
                }`}
              >
                <p
                  className="pr-8"
                  dangerouslySetInnerHTML={{ __html: message.text }}
                ></p>
              </div>
            </div>
            {message.sender === "ai" && (
              <div
                onClick={() => handleCopyMessage(message.text)}
                className="cursor-pointer ml-2"
              >
                {copied ? (
                  <FaClipboardCheck className="text-green-500" />
                ) : (
                  <FaClipboard className="text-gray-600" />
                )}
              </div>
            )}
            {message.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold">
                EU
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 pl-4 mb-4">
            Sofi está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleGenerateCopy}
          className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Gerar Copy
        </button>
      </div>
    </div>
  );
};

export default Agente4Page;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "../types";
import MessageList from "../components/MessageList";
import remarketingList from "../data/remarketingList"; // arquivo externo com as mensagens

const Agente3Page: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ultimaEntradaValida, setUltimaEntradaValida] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mensagemInicial: ChatMessage = {
      id: Date.now(),
      text: "Oi, tudo bem? Para gerar o remarketing de hoje é só clicar no botão abaixo.",
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
    const irrelevantes = [
      "oi",
      "olá",
      "tudo bem",
      "ok",
      "quero",
      "sim",
      "não",
      "me ajuda",
    ];
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

    const sugestoes = remarketingList[userText.toLowerCase()];

    if (!sugestoes || sugestoes.length === 0) {
      const mensagemErro: ChatMessage = {
        id: Date.now() + 1,
        text: "Ainda não tenho mensagens prontas para essa oferta. Pode me dar mais detalhes ou tente outro nome!",
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
      text: "Se quiser gerar outro é só clicar no botão abaixo 💬",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage, followUp]);
    setIsTyping(false);
  };

  // Função para gerar o remarketing de hoje quando o botão for clicado
  const handleGenerateRemarketing = () => {
    const textoGerado = "remarketing"; // Isso pode ser customizado de acordo com a lógica necessária
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
        <div className="bg-blue-100 shadow-md p-4 rounded-xl flex items-center gap-4">
          <div className="relative">
            <img
              src="/agente3.webp"
              alt="Luma"
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-ping z-10"></span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Luma</h2>
            <p className="text-sm text-green-600 font-medium">Online</p>
            <p className="text-sm text-gray-600">
              Crio mensagens estratégicas para manter leads engajados e prontos
              para a compra.
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
                  src="/agente3.webp"
                  alt="Luma"
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
                <p className="pr-8">{message.text}</p>
              </div>
            </div>
            {message.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold">
                EU
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 pl-4 mb-4">
            Luma está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Substituindo o campo de input por um único botão */}
      <div className="p-4 border-t">
        <button
          onClick={handleGenerateRemarketing}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Gerar Remarketing
        </button>
      </div>
    </div>
  );
};

export default Agente3Page;

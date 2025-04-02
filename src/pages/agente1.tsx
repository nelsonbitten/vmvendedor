import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCopy, FaCheck } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { ChatMessage } from "../types";
import legendaList from "../data/legendaList";

const temasSugeridos = ["Maquininhas", "Legenda Aleatória", "Promoção"];

const Agente1Page: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ultimaEntradaValida, setUltimaEntradaValida] = useState<string | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mensagemInicial: ChatMessage = {
      id: Date.now(),
      text: "Legendas criativas? Engajamento? Deixa comigo! Só clicar no botão! 😍",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([mensagemInicial]);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
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

    if (textoLimpo === "maquininhas") {
      setTimeout(() => {
        const pergunta: ChatMessage = {
          id: Date.now() + 1,
          text: "Para qual maquininha? T1, T2, T3 ou T3 SMART:",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, pergunta]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    const opcoesMaquininha = ["t1", "t2", "t3", "t3 smart"];
    if (opcoesMaquininha.includes(textoLimpo)) {
      const sugestoes = legendaList[textoLimpo];
      if (!sugestoes || sugestoes.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            text: "Ainda não tenho legendas prontas para essa maquininha. Tente outra!",
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        return;
      }
      const index = Math.floor(Math.random() * sugestoes.length);
      const resposta = sugestoes[index];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 3,
            text: resposta,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
      return;
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
    if (!temaSelecionado) {
      handleSendMessage("legenda");
    } else {
      handleSendMessage(temaSelecionado);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Topo fixo estilo WhatsApp */}
      <div className="fixed top-0 left-0 right-0 z-40 p-2 border-b border-gray-200 shadow-sm bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-2xl text-green-600 hover:text-green-700 transition"
          >
            ←
          </button>
          <div className="relative">
            <img
              src="/agente1.webp"
              alt="Kora"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-20"></span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Kora
            </h2>
            <span className="text-xs text-green-600">online</span>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}>
          <IoIosInformationCircle className="text-green-600 w-6 h-6 hover:text-green-700 transition" />
        </button>
      </div>

      {/* Espaço reservado para o topo fixo */}
      <div className="h-16 sm:h-[72px] shrink-0" />

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pt-4 pb-[160px] sm:pb-4">
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

                {message.text.includes("Para qual maquininha") && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["T1", "T2", "T3", "T3 SMART"].map((opcao) => (
                      <button
                        key={opcao}
                        onClick={() => handleSendMessage(opcao)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600"
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>
                )}

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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-4 w-[90%] max-w-sm text-center">
            <img
              src="/agente1.webp"
              alt="Kora"
              className="w-20 h-20 mx-auto rounded-full object-cover mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-800">Kora</h2>
            <p className="text-sm text-gray-600 mt-1">
              Sou sua ajudante de legendas criativas! Me diga o tema e eu te
              entrego sugestões prontas para bombar nas redes! 🚀
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="fixed bottom-0 w-full bg-white shadow-inner z-40 sm:static sm:shadow-none border-t border-gray-100">
        <div className="px-4 py-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 font-medium">
            <HiOutlineLightBulb className="w-5 h-5 text-yellow-500" />
            Escolha um tema para sua legenda
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={temaSelecionado}
              onChange={(e) => setTemaSelecionado(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="" disabled>
                Selecione um tema criativo...
              </option>
              {temasSugeridos.map((tema) => (
                <option key={tema} value={tema}>
                  {tema}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateLegenda}
              className="w-full sm:w-auto px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base font-semibold"
            >
              Gerar Legenda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agente1Page;

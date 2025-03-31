"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types";
import {
  Bot,
  User,
  Copy,
  Check,
  BadgeHelp,
  BookText,
  Repeat,
  Megaphone,
} from "lucide-react";
import TypingAnimation from "./TypingAnimation";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isDarkMode: boolean;
  onSendMessage?: (message: ChatMessage) => void;
  onBackToMenu?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  isDarkMode,
  onSendMessage,
  onBackToMenu,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [step, setStep] = useState<
    "analise_perfil" | "bio" | "remarketing" | "copywriting" | ""
  >("");
  const [product, setProduct] = useState<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const sendMessageToAI = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3002/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      return data.response || data.reply || "Erro ao obter resposta.";
    } catch (err) {
      console.error("Erro na requisição:", err);
      return "❌ Não foi possível se comunicar com a IA.";
    }
  };

  const handleUserMessage = async (userMessageText: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    onSendMessage?.(userMessage);

    let prompt = "";

    switch (step) {
      case "analise_perfil":
        prompt = `O usuário está pedindo ajuda com análise de perfil. Ele disse: "${userMessageText}". Responda como um especialista em posicionamento digital.`;
        break;

      case "bio":
        prompt = `Crie uma biografia curta e eficaz para redes sociais com base nisso: "${userMessageText}".`;
        break;

      case "copywriting":
        prompt = `Crie um texto persuasivo para vender o seguinte produto ou serviço: "${userMessageText}".`;
        break;

      case "remarketing":
        if (userMessageText.toLowerCase() === "sim") {
          prompt = `Gere outro texto de remarketing para o produto: "${product}".`;
        } else if (userMessageText.toLowerCase() === "não") {
          const endMessage: ChatMessage = {
            id: Date.now() + 1,
            text: "Ok, se precisar de mais, é só chamar!",
            sender: "ai",
            timestamp: new Date(),
          };
          onSendMessage?.(endMessage);
          setStep("");
          return;
        } else {
          prompt = `Gere um texto de remarketing para o produto: "${userMessageText}".`;
          setProduct(userMessageText);
        }
        break;

      default:
        prompt = userMessageText;
        break;
    }

    const aiReply = await sendMessageToAI(prompt);

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      text: aiReply,
      sender: "ai",
      timestamp: new Date(),
    };

    onSendMessage?.(aiMessage);

    if (step === "remarketing") {
      const moreMessage: ChatMessage = {
        id: Date.now() + 2,
        text: "Quer gerar mais um texto de remarketing?",
        sender: "ai",
        timestamp: new Date(),
      };
      onSendMessage?.(moreMessage);
    }
  };

  const handleMenuClick = async (titulo: string) => {
    let fluxo: typeof step = "";
    let initialPrompt = "";

    // Determinando o fluxo e o prompt com base no título do menu
    switch (titulo) {
      case "Analista de Perfis do Instagram":
        fluxo = "analise_perfil";
        initialPrompt =
          "Você quer ajuda com análise de perfil pessoal ou profissional?";
        break;
      case "Criadora de Bio":
        fluxo = "bio";
        initialPrompt =
          "Conte um pouco sobre você ou sua marca para eu gerar uma bio.";
        break;
      case "Especialista em Remarketing":
        fluxo = "remarketing";
        initialPrompt =
          "Clique no produto para gerar o texto de remarketing:\n\n1. Maquininha Ton\n2. Produto A\n3. Produto B";
        break;
      case "Especialista em Copy":
        fluxo = "copywriting";
        initialPrompt =
          "Digite o nome do produto ou serviço que deseja promover.";
        break;
      default:
        fluxo = "";
        initialPrompt = "Como posso te ajudar?";
        break;
    }

    // Atualiza o estado de 'step' com o fluxo atual
    setStep(fluxo);

    // Criar a mensagem do usuário com o título correto
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: `Quero ajuda com ${titulo}`, // A mensagem enviada será o título do menu
      sender: "user",
      timestamp: new Date(),
    };

    // Criar a mensagem da IA com o prompt gerado com base no título do menu
    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      text: initialPrompt, // A IA responderá com o prompt correto
      sender: "ai",
      timestamp: new Date(),
    };

    // Envia as mensagens para o fluxo de conversa
    if (onSendMessage) {
      onSendMessage(userMessage); // Envia a mensagem do usuário com o título do menu
      onSendMessage(aiMessage); // Envia a resposta da IA com o prompt correspondente
    }
  };

  const getRemarketingText = async (product: string) => {
    const response = await fetch("http://localhost:3002/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Gerar texto de remarketing para o produto: ${product}`,
      }),
    });

    const data = await response.json();
    return data.response || data.reply || "Erro ao gerar texto de remarketing.";
  };

  const menus = [
    {
      titulo: "Analista de Perfis do Instagram",
      descricao:
        "Analisarei seu perfil no Instagram e darei sugestões para impulsionar sua presença online.",
      icone: BadgeHelp,
      imagem: "/agente1.png", // Primeiro agente
      nome: "Bia",
    },
    {
      titulo: "Criadora de Bio",
      descricao:
        "Crio uma bio impactante e única que vai destacar você nas redes sociais.",
      icone: BookText,
      imagem: "/agente2.png", // Segundo agente
      nome: "Maria",
    },
    {
      titulo: "Especialista em Remarketing",
      descricao:
        "Crio mensagens estratégicas para manter leads engajados e prontos para a compra.",
      icone: Repeat,
      imagem: "/agente3.png", // Terceiro agente
      nome: "Joana",
    },
    {
      titulo: "Especialista em Copy",
      descricao:
        "Transformo ideias em palavras persuasivas que vendem e engajam.",
      icone: Megaphone,
      imagem: "/agente4.png", // Quarto agente
      nome: "Carlos",
    },
  ];

  return (
    <div
      className={`absolute inset-0 overflow-y-auto p-4 space-y-4 overscroll-none ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {messages.length > 0 && (
        <div className="mb-2">
          <button
            onClick={onBackToMenu}
            className={`text-sm underline font-medium ${
              isDarkMode ? "text-teal-400" : "text-teal-700"
            } hover:opacity-80`}
          >
            ← Voltar ao menu inicial
          </button>
        </div>
      )}

      {messages.length === 0 && (
        <div
          className={`text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } mt-8`}
        >
          <div className="flex justify-center items-center mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-16 h-16 rounded-full object-contain bg-white dark:bg-gray-800 shadow"
            />
          </div>
          <p
            className={`text-lg font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            🚀 Acelere suas vendas com IA
          </p>
          <p
            className={`text-sm mb-6 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            A ferramenta inteligente feita para vendedores.
          </p>

          <div className="max-w-2xl mx-auto space-y-3">
            {menus.map(
              ({ titulo, descricao, icone: Icon, imagem, nome }, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(titulo)}
                  className={`w-full p-4 rounded-xl border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } transition-all duration-200 group text-left flex items-start gap-3`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={imagem}
                      alt={nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      {/* Nome do agente ao lado do título */}
                      <div className="flex items-center gap-2">
                        <span
                          className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {nome}
                        </span>
                        <h3
                          className={`font-medium ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {titulo}
                        </h3>
                      </div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {descricao}
                      </p>
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.sender === "ai" && (
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-7 h-7 rounded-full object-contain"
              />
            </div>
          )}

          <div className="relative group max-w-[80%]">
            <div
              className={`rounded-lg p-4 ${
                message.sender === "user"
                  ? isDarkMode
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "bg-gray-100 text-gray-800"
                  : isDarkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-[#f7f7f8] text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap pr-8">
                {message.text}
              </p>

              <span
                className={`text-[11px] sm:text-xs mt-2 block ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>

              <button
                onClick={() => handleCopy(message.text, message.id)}
                className={`absolute top-2 right-2 p-1.5 rounded-md transition-opacity ${
                  copiedId === message.id
                    ? "opacity-100 bg-green-500 text-white"
                    : `opacity-0 group-hover:opacity-100 ${
                        isDarkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                      }`
                }`}
                title="Copiar mensagem"
              >
                {copiedId === message.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {message.sender === "user" && (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div
            className={`rounded-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-[#f7f7f8] border border-gray-200"
            }`}
          >
            <TypingAnimation isDarkMode={isDarkMode} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      <div
        className={`mt-4 border-t pt-4 ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem(
              "userInput"
            ) as HTMLInputElement;
            const value = input.value.trim();
            if (value) {
              handleUserMessage(value);
              input.value = "";
            }
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            name="userInput"
            placeholder="Digite sua mensagem..."
            className={`flex-1 px-4 py-2 rounded-lg border text-sm outline-none ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-800 border-gray-300 placeholder-gray-500"
            }`}
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageList;

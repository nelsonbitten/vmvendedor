import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "../types";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { sendMessageToAI } from "../services/api";

const Agente2Page: React.FC = () => {
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
      text: "Oi! 😊 Me conta qual é o seu produto, serviço ou área de atuação que eu crio uma bio perfeita pra você usar no Instagram!",
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
      "e aí",
      "bom dia",
      "boa tarde",
      "boa noite",
      "ok",
      "quero",
      "não sei",
      "sim",
      "não",
      "help",
      "me ajuda",
    ];

    const pedidoNovaVersao = [
      "quero outra",
      "outra",
      "mais uma",
      "me dá mais uma",
      "sim quero mais uma",
      "quero mais uma",
      "manda outra",
      "sim",
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

    if (
      userText.trim().length < 6 ||
      irrelevantes.includes(userText.trim().toLowerCase())
    ) {
      const mensagemPedindoInfo: ChatMessage = {
        id: Date.now() + 1,
        text: "Pra eu criar sua bio, me conta: qual é o seu produto, serviço ou área de atuação? 💼",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mensagemPedindoInfo]);
      setIsTyping(false);
      return;
    }

    const prompt = `
Você é Ayra, estrategista digital especialista em criação de bios para Instagram.

⚠️ IMPORTANTE:
Antes de gerar qualquer bio, avalie criticamente a entrada do usuário. Se ela **não contiver informação suficiente para entender com clareza o que o produto ou serviço oferece**, você **não deve criar uma bio ainda**.

Exemplo de entradas vagas:
- "vendo Secaps Black"
- "me ajuda com uma bio"
- "quero uma bio pro meu perfil"
- "cria uma aí"

Nesses casos, **nunca tente adivinhar** o que é o produto. Pergunte com empatia:
"Esse produto é voltado pra quê? Qual o principal benefício que ele entrega?"

🧠 Quando tiver contexto suficiente, siga as diretrizes abaixo para criar a bio:

- No máximo 150 caracteres
- Clareza, estratégia e autenticidade
- Emojis com moderação
- CTA no final (ex: “Clique no link”, “Saiba mais”, “Acesse agora”)
- Nunca use hashtags, travessões ou frases genéricas
- A resposta deve conter **apenas a bio**, sem explicações ou texto adicional
- NUnca pergunte novamente sore o negocio do cliente quando ele pedir outra versão, se ele ja pesu apenas faça a nova com base no que ele já informou.
- Não repita essa frase na mesma sequencia: Se quiser ajustar ou criar outra versão, é só me falar! 💬

Mensagem recebida do usuário:
"${userText}"

Se o conteúdo não for suficiente, pare tudo e peça mais contexto. Se for suficiente, gere uma bio incrível. Após a resposta, diga:
"Se quiser ajustar ou criar outra versão, é só me falar! 💬"
`;

    try {
      const aiText = await sendMessageToAI(prompt);

      const aiMessage: ChatMessage = {
        id: Date.now() + 2,
        text: aiText,
        sender: "ai",
        timestamp: new Date(),
      };

      const followUp: ChatMessage = {
        id: Date.now() + 3,
        text: "Se quiser ajustar ou criar outra versão, é só me falar! 💬",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage, followUp]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: Date.now() + 4,
        text: "Opa! Algo deu errado ao gerar sua bio. Tenta de novo em instantes 💜",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Voltar */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-lg">←</span> Voltar
        </button>
      </div>

      {/* Card do agente */}
      <div className="p-4 pt-0">
        <div className="bg-purple-100 shadow-md p-4 rounded-xl flex items-center gap-4">
          <div className="relative">
            <img
              src="/agente2.webp"
              alt="Ayra"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-ping z-10"></span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Ayra</h2>
            <p className="text-sm text-green-600 font-medium">Online</p>
            <p className="text-sm text-gray-600">
              Criadora de Bio — Crio bios que traduzem sua essência de forma
              criativa e estratégica. ✨
            </p>
          </div>
        </div>
      </div>

      {/* Lista de mensagens */}
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
                  src="/agente2.webp"
                  alt="Ayra"
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
            Ayra está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <MessageInput isDarkMode={false} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Agente2Page;

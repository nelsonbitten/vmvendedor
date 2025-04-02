import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "../types";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { sendMessageToAI } from "../services/api";

const Agente4Page: React.FC = () => {
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
      text: "Oi! 😊 Me conta o que você está anunciando e eu crio uma copy irresistível pro seu anúncio!",
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
        text: "Pra eu criar sua copy, me conta o que você está anunciando! 💡",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mensagemPedindoInfo]);
      setIsTyping(false);
      return;
    }

    const prompt = `
Você é Sofi, especialista em copywriting para anúncios.

⚠️ IMPORTANTE:
Antes de gerar qualquer copy, avalie criticamente a entrada do usuário. Se ela **não contiver informação suficiente sobre o produto, serviço ou oferta que será anunciada**, você **não deve criar uma copy ainda**.

Exemplo de entradas vagas:
- "cria uma copy pra mim"
- "preciso de uma copy"
- "me ajuda com anúncio"

Nesses casos, **nunca tente adivinhar** o que é o produto. Pergunte com empatia:
"O que exatamente você está anunciando? Qual é o principal benefício ou diferencial que quer destacar?"

🧠 Quando tiver contexto suficiente, siga as diretrizes abaixo para criar a copy:

- Comece com um gancho forte e chamativo
- Destaque o principal benefício do produto
- Linguagem emocional, persuasiva e direta
- Use emojis com moderação se fizer sentido
- Finalize com uma chamada clara pra ação (ex: "Clique agora", "Garanta já o seu")
- A resposta deve conter **apenas a copy**, sem explicações adicionais
- Nunca pergunte novamente sobre o produto quando o cliente pedir outra versão
- Não repita a frase "Se quiser ajustar ou criar outra versão..." em sequência

Mensagem recebida do usuário:
"${userText}"

Se o conteúdo não for suficiente, pare tudo e peça mais contexto. Se for suficiente, gere uma copy de anúncio irresistível. Após a resposta, diga:
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
        text: "Opa! Algo deu errado ao gerar sua copy. Tente novamente em instantes 💜",
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
            <h2 className="text-lg font-semibold text-gray-800">Sofi</h2>
            <p className="text-sm text-green-600 font-medium">Online</p>
            <p className="text-sm text-gray-600">
              Transformo ideias em palavras persuasivas que vendem e engajam.
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
            Sofi está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <MessageInput isDarkMode={false} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Agente4Page;

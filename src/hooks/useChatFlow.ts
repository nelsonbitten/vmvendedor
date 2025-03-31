import { useState } from "react";
import { ChatMessage } from "../types";
import { sendMessageToAI } from "../services/api"; // a gente vai criar esse em breve

type Step = "analise_perfil" | "bio" | "remarketing" | "copywriting" | "";

export function useChatFlow(onSendMessage?: (message: ChatMessage) => void) {
  const [step, setStep] = useState<Step>("");
  const [product, setProduct] = useState<string>("");

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

  const handleMenuClick = (titulo: string) => {
    let fluxo: Step = "";
    let initialPrompt = "";

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

    setStep(fluxo);

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: `Quero ajuda com ${titulo}`,
      sender: "user",
      timestamp: new Date(),
    };

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      text: initialPrompt,
      sender: "ai",
      timestamp: new Date(),
    };

    onSendMessage?.(userMessage);
    onSendMessage?.(aiMessage);
  };

  return {
    step,
    setStep,
    handleUserMessage,
    handleMenuClick,
  };
}

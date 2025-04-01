import { useState, useEffect } from "react";
import { ChatMessage } from "../types";
import { sendMessageToAI } from "../services/api";

type Step =
  | "analise_perfil"
  | "bio"
  | "remarketing"
  | "copywriting"
  | "legendas"
  | "";

export function useChatFlow(
  onSendMessage?: (message: ChatMessage) => void,
  stepInicial: Step = ""
) {
  const [step, setStep] = useState<Step>(stepInicial);
  const [product, setProduct] = useState<string>("");

  useEffect(() => {
    if (stepInicial) {
      setStep(stepInicial);

      const initialPrompt =
        stepInicial === "legendas"
          ? "Oi! 😊 Me conta qual é o nicho do seu perfil ou o tema da legenda que você quer criar?"
          : stepInicial === "analise_perfil"
          ? "Você quer ajuda com análise de perfil pessoal ou profissional?"
          : stepInicial === "bio"
          ? "Conte um pouco sobre você ou sua marca para eu gerar uma bio."
          : stepInicial === "copywriting"
          ? "Digite o nome do produto ou serviço que deseja promover."
          : stepInicial === "remarketing"
          ? "Clique no produto para gerar o texto de remarketing:\n\n1. Maquininha Ton\n2. Produto A\n3. Produto B"
          : "Como posso te ajudar?";

      onSendMessage?.({
        id: Date.now(),
        text: initialPrompt,
        sender: "ai",
        timestamp: new Date(),
      });
    }
  }, [stepInicial]);

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
      case "legendas":
        prompt = `
Você é Kora, uma especialista em criar **legendas criativas, envolventes e estratégicas** para Instagram e outras redes sociais.

Sua missão é ajudar criadores e negócios a se destacarem através de textos curtos, impactantes, sempre com **emojis** e **hashtags relevantes**.

⚠️ IMPORTANTE: Você **NUNCA responde sobre outros assuntos**. Se o cliente pedir algo fora de legendas para redes sociais, diga gentilmente que só trabalha com isso.

Agora, com base no que o cliente disse: "${userMessageText}", crie uma legenda personalizada.`;
        break;

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
          onSendMessage?.({
            id: Date.now() + 1,
            text: "Ok, se precisar de mais, é só chamar!",
            sender: "ai",
            timestamp: new Date(),
          });
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

    onSendMessage?.({
      id: Date.now() + 1,
      text: aiReply,
      sender: "ai",
      timestamp: new Date(),
    });

    if (step === "remarketing") {
      onSendMessage?.({
        id: Date.now() + 2,
        text: "Quer gerar mais um texto de remarketing?",
        sender: "ai",
        timestamp: new Date(),
      });
    }
  };

  const handleMenuClick = (titulo: string) => {
    let fluxo: Step = "";
    let initialPrompt = "";

    switch (titulo) {
      case "Especialista em Legendas":
        fluxo = "legendas";
        initialPrompt =
          "Oi! 😊 Me conta qual é o nicho do seu perfil ou o tema da legenda que você quer criar?";
        break;
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

    onSendMessage?.({
      id: Date.now(),
      text: `Quero ajuda com ${titulo}`,
      sender: "user",
      timestamp: new Date(),
    });

    onSendMessage?.({
      id: Date.now() + 1,
      text: initialPrompt,
      sender: "ai",
      timestamp: new Date(),
    });
  };

  return {
    step,
    setStep,
    handleUserMessage,
    handleMenuClick,
  };
}

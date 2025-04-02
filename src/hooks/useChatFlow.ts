import { useState, useEffect } from "react";
import { ChatMessage } from "../types";
import { sendMessageToAI } from "../services/api";
import { agents } from "../agents";

type Step = keyof typeof agents | "";

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
        agents[stepInicial]?.initialPrompt || "Como posso te ajudar?";

      console.log("📩 Prompt inicial do agente:", initialPrompt);

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
    console.log("🧠 agents disponíveis:", agents);

    let prompt = "";

    const chave: Step = (step || stepInicial) as Step;
    const validKeys = Object.keys(agents);

    const agenteAtivo = agents[chave];

    // ⚠️ Fluxo especial da Ayra (bio para Instagram)
    if (step === "bio") {
      prompt = `
Você é especialista em criar bios para perfis do Instagram. 

Objetivo:
- Criar bios criativas, diretas e alinhadas ao que o usuário faz
- Sempre usar emojis (sem exageros)
- Incluir uma CTA (ex: “Clique no link”, “Saiba mais”, “Acesse agora”)
- Bio com no máximo 150 caracteres
- Sem hashtags
- Não use travessão no início
- A resposta deve conter apenas a bio, sem explicações adicionais

Contexto do usuário: "${userMessageText}"

No final, sugira com gentileza que podemos ajustar ou criar outra versão se ele quiser.
`;

      console.log("✨ Prompt para Ayra:", prompt);

      const aiReply = await sendMessageToAI(prompt);

      onSendMessage?.({
        id: Date.now() + 1,
        text: aiReply,
        sender: "ai",
        timestamp: new Date(),
      });

      onSendMessage?.({
        id: Date.now() + 2,
        text: "Se quiser ajustar ou criar outra versão, é só me falar! 💬",
        sender: "ai",
        timestamp: new Date(),
      });

      return;
    }

    // 🟡 Fluxo padrão de remarketing
    if (step === "remarketing") {
      const lowerText = userMessageText.toLowerCase();
      if (lowerText === "sim") {
        prompt = `Gere outro texto de remarketing para o produto: "${product}".`;
      } else if (lowerText === "não") {
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
    } else if (agenteAtivo?.generatePrompt) {
      prompt = agenteAtivo.generatePrompt(userMessageText);
      console.log("📬 Prompt gerado pelo agente:", prompt);
    } else {
      prompt = userMessageText;
      console.warn("⚠️ Nenhum generatePrompt encontrado. Usando texto cru.");
    }

    console.log("🔧 Prompt final enviado para IA:", prompt);

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
    console.log("🔁 Título clicado:", titulo);

    let fluxo: Step = "";
    switch (titulo) {
      case "Especialista em Legendas":
        fluxo = "legendas";
        break;
      case "Criadora de Bio":
        fluxo = "bio";
        break;
      case "Especialista em Remarketing":
        fluxo = "remarketing";
        break;
      case "Especialista em Copy":
        fluxo = "copywriting";
        break;
      default:
        fluxo = "";
        break;
    }

    setStep(fluxo);

    const initialPrompt =
      agents[fluxo]?.initialPrompt || "Como posso te ajudar?";
    console.log("💬 Prompt inicial do menu:", initialPrompt);

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

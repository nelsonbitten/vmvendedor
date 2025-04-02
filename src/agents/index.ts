import { bioAgent } from "./bioAgent";
import { copywritingAgent } from "./copywritingAgent";
import { legendaAgent } from "./legendaAgent";
import { remarketingAgent } from "./remarketingAgent";
import { Agent } from "./types";

export const agents: Record<string, Agent> = {
  bio: bioAgent,
  copywriting: copywritingAgent,
  legendas: legendaAgent,
  remarketing: remarketingAgent,
};

// ✅ Log de verificação de agents carregados
console.log("🧠 agents carregados no index.ts:", Object.keys(agents));

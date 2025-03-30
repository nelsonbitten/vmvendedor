import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // usar variável de ambiente no Vite
  dangerouslyAllowBrowser: false, // segurança: não rodar direto no navegador
});

export default openai;

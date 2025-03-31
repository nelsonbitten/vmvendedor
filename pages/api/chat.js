import OpenAI from "openai";

// Verifica se a chave da API está configurada
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Chave da API OpenAI não configurada.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Verifica se o método da requisição é POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Extrai a mensagem do corpo da requisição
  const { message } = req.body;

  // Validação para garantir que a mensagem é uma string não vazia
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Mensagem inválida ou ausente." });
  }

  try {
    // Chama a OpenAI para gerar a resposta com base na mensagem do usuário
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Usando o modelo GPT-3.5
      messages: [{ role: "user", content: message }],
    });

    // Verifica se a resposta gerada pela IA não está vazia
    if (!completion.choices || completion.choices.length === 0) {
      return res.status(500).json({
        error: "A IA não retornou uma resposta válida.",
      });
    }

    // Retorna a resposta da IA
    const aiMessage = completion.choices[0].message.content.trim();
    return res.status(200).json({
      reply: aiMessage, // Resposta da IA para o frontend
    });
  } catch (error) {
    // Em caso de erro, exibe detalhes no console para depuração
    console.error("Erro ao chamar a IA:", error);

    // Retorna uma mensagem de erro amigável para o frontend
    return res.status(500).json({
      error: "Erro ao gerar resposta da IA. Tente novamente mais tarde.",
    });
  }
}

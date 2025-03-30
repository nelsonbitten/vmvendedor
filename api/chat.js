import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Erro na função chat:", error);
    return res.status(500).json({
      error: "Erro ao gerar resposta da IA",
    });
  }
}

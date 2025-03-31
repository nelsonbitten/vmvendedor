require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ✅ Cria o cliente OpenAI com base no .env
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware de autenticação (caso queira proteger alguma rota)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// 🧠 Rota de chat principal
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  console.log("Mensagem recebida:", message);

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
      Você é um consultor sênior da iAgência — uma agência de marketing e vendas especializada em impulsionar negócios com estratégias digitais personalizadas.
      
      Sua missão é orientar clientes com clareza, gerar textos profissionais e persuasivos, e responder como um especialista experiente em marketing, copywriting, vendas, funis, redes sociais e posicionamento digital.
      
      Use linguagem acessível, estratégica e direta ao ponto. Fale como um humano experiente, criativo e com visão de negócio. Quando precisar, faça perguntas para entender melhor o contexto antes de responder.
      
      Nunca responda de forma genérica. Sempre entregue valor real, como um verdadeiro especialista de agência.
         
      Sempre que te pedir remarketing para a maquininha do Ton você vai fazr um texto curto e direto, focando na taxa de 0,74%.
      `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log("Resposta da OpenAI:", completion);

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    res.status(500).json({
      error: "Failed to get response from OpenAI",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

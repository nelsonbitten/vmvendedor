// src/services/api.ts

export async function sendMessageToAI(message: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:3002/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return (
      data.response || data.reply || "❌ Erro ao processar resposta da IA."
    );
  } catch (error) {
    console.error("Erro na requisição:", error);
    return "❌ Não foi possível se comunicar com a IA.";
  }
}

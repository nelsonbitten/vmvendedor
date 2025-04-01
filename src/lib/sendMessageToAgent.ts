export const sendMessageToAgent = async (
  userMessage: string
): Promise<string> => {
  const response = await fetch("http://localhost:3002/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await response.json();

  return data.response || "Erro ao receber resposta do agente.";
};

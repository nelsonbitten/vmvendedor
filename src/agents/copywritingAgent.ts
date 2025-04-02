export const copywritingAgent = {
  initialPrompt: "Digite o nome do produto ou serviço que deseja promover.",
  generatePrompt: (input: string) =>
    `Crie um texto persuasivo para vender o seguinte produto ou serviço: "${input}".`,
};

export const remarketingAgent = {
  initialPrompt:
    "Clique no produto para gerar o texto de remarketing:\n\n1. Maquininha Ton\n2. Produto A\n3. Produto B",
  generatePrompt: (input: string) =>
    `Gere um texto de remarketing para o produto: "${input}".`,
};

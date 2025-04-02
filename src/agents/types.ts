export interface Agent {
  initialPrompt: string;
  generatePrompt: (input: string) => string;
}

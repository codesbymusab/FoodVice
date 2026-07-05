export default interface IAIService {
  sendPrompt(prompt: string): Promise<unknown>;
}

// 
import IAIService from '../../../application/interfaces/services/AIService'
const axios = require("axios")

class GroqService implements IAIService {
 

  async sendPrompt(prompt:string) {

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    return response.data?.choices?.[0]?.message?.content?.trim() || ""
  }
}

export default GroqService

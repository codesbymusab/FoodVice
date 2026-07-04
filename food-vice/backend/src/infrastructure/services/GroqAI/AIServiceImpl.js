const axios = require("axios")

class GroqService {
 

  async sendPrompt(prompt) {

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

module.exports = GroqService

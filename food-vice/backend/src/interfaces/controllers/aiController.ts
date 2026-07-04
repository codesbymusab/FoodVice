import { Request, Response } from 'express'
import RestaurantRepoImpl from '../../infrastructure/database/mongodb/repositories/RestaurantRepoImpl'
import ReviewRepoImpl from '../../infrastructure/database/mongodb/repositories/ReviewRepoImpl'
import { buildPrompt } from '../../application/use-cases/ai/AIPromptBuilder'
import GroqService from '../../infrastructure/services/GroqAI/AIServiceImpl'
import { AIRecommendationsDTO } from '../../application/dtos/input/AI/RecommendationsDTO'
import { AISummaryDTO } from '../../application/dtos/input/AI/SummaryDTO'
import { AIChatDTO } from '../../application/dtos/input/AI/ChatDTO'

function parseStrictJson(content: string) {
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new Error('AI response was not valid JSON')
  }
}

export default class AIController {
  constructor(
    private restaurantRepo: RestaurantRepoImpl,
    private reviewRepo: ReviewRepoImpl,
    private groqService: GroqService
  ) {
    this.aiRecommendations = this.aiRecommendations.bind(this)
    this.aiSummary = this.aiSummary.bind(this)
    this.aiChat = this.aiChat.bind(this)
  }

  aiRecommendations = async (req: Request, res: Response) => {
    try {
      const { query, location, limitCount = 20} = req.validatedBody as AIRecommendationsDTO
      const userId=(req as any).userId
      const nearbyRestaurants = await this.restaurantRepo.getNearby(
        [location.lon, location.lat],
        { distance: location.distance, limitCount },
        userId
      )

      const prompt = buildPrompt('recommendations', {
        query,
        location,
        restaurants: nearbyRestaurants,
      })

      const aiResponse = await this.groqService.sendPrompt(prompt)
      const jsonResponse = parseStrictJson(aiResponse)

      return res.status(200).json(jsonResponse)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error instanceof Error ? error.message : 'AI recommendation failed' })
    }
  }

  aiSummary = async (req: Request, res: Response) => {
    try {
      const { restaurantId,cursor,restaurantName, limit } = req.validatedBody as AISummaryDTO
      const userId=(req as any).userId
      const reviews = await this.reviewRepo.getReviews({ userId,restId: restaurantId, cursor ,limit })

      const prompt = buildPrompt('summary', {
        restaurantName,
        reviews,
      })

      const aiResponse = await this.groqService.sendPrompt(prompt)
      const jsonResponse = parseStrictJson(aiResponse)

      return res.status(200).json(jsonResponse)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error instanceof Error ? error.message : 'AI summary failed' })
    }
  }

  aiChat = async (req: Request, res: Response) => {
    try {
      const { messages, location, limitCount } = req.validatedBody as AIChatDTO
      const userId=(req as any).userId
      const nearbyRestaurants = await this.restaurantRepo.getNearby(
        [location.lon, location.lat],
        { distance: location.distance, limitCount },
        userId
      )

      const prompt = buildPrompt('chat', {
        messages,
        location,
        restaurants: nearbyRestaurants,
      })

      const aiResponse = await this.groqService.sendPrompt(prompt)
      const jsonResponse = parseStrictJson(aiResponse)

      return res.status(200).json(jsonResponse)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error instanceof Error ? error.message : 'AI chat failed' })
    }
  }
}

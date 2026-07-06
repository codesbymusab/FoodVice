import { Request, Response } from 'express'
import TopicRepoImpl from '../../infrastructure/database/mongodb/repositories/TopicRepoImpl'
import { ThreadTopicDTO } from '../../application/dtos/input/Thread/ThreadTopicDTO'

export default class TopicController {
  constructor(private topicRepo: TopicRepoImpl) {
    this.getAllTopics = this.getAllTopics.bind(this)
    this.createTopic = this.createTopic.bind(this)
    this.getTopicById = this.getTopicById.bind(this)
  }

  async getAllTopics(req: Request, res: Response) {
    try {
      const topics = await this.topicRepo.findAll()
      res.json(topics)
    } catch (error) {
      console.error('Error fetching topics:', error)
      res.status(500).json({ error: 'Failed to fetch topics' })
    }
  }

  async createTopic(req: Request, res: Response) {
    try {
      const { name } = req.validatedBody as ThreadTopicDTO
      if (!name) {
        return res.status(400).json({ error: 'Topic name is required' })
      }

      const topic = await this.topicRepo.create({ name })
      res.status(201).json(topic)
    } catch (error) {
      console.error('Error creating topic:', error)
      res.status(500).json({ error: 'Failed to create topic' })
    }
  }

  async getTopicById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const topic = await this.topicRepo.findById(id as string)
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' })
      }
      res.json(topic)
    } catch (error) {
      console.error('Error fetching topic:', error)
      res.status(500).json({ error: 'Failed to fetch topic' })
    }
  }
}

import { Request, Response } from 'express'
import { CommentDTO } from '../../application/dtos/input/Comment/CommentDTO'

const GetReelComments = require('../../application/use-cases/reels/GetReelComments')
const PostReelComment = require('../../application/use-cases/reels/PostReelComment')

export default class CommentController {
  constructor(
    private getReelComments: typeof GetReelComments,
    private postReelComment: typeof PostReelComment
  ) {
    this.getComments = this.getComments.bind(this)
    this.postComment = this.postComment.bind(this)
  }

  async getComments(req: Request, res: Response) {
    try {
      const { reelId } = req.params
      const userId = req.userId
      const comments = await this.getReelComments.execute({ reelId, userId })
      return res.status(200).json(comments)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err instanceof Error ? err.message : err })
    }
  }

  async postComment(req: Request, res: Response) {
    try {
      const { reelId } = req.params
      const { text } = req.validatedBody as CommentDTO
      const userId=(req as any).userId
      const comment = await this.postReelComment.execute({ reelId, userId, text })
      return res.status(201).json(comment)
    } catch (err) {
      console.error(err)
      return res.status(400).json({ error: err instanceof Error ? err.message : err })
    }
  }
}



import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { ThreadDTO } from '../../application/dtos/input/Thread/ThreadDTO'
import { ThreadQueryParams } from '../../application/dtos/input/Thread/ThreadQueryParams'
import { ThreadCommmentDTO } from '../../application/dtos/input/Thread/ThreadCommentDTO'

export default class ThreadController {
  constructor(
    private threadRepo: any,
    private mediaRepo: any,
    private storageService: any
  ) {
    this.createThread = this.createThread.bind(this)
    this.getThreadsByCommunity = this.getThreadsByCommunity.bind(this)
    this.getAllThreads = this.getAllThreads.bind(this)
    this.getThreadById = this.getThreadById.bind(this)
    this.likeThread = this.likeThread.bind(this)
    this.dislikeThread = this.dislikeThread.bind(this)
    this.toggleCommentLike = this.toggleCommentLike.bind(this)
    this.addComment = this.addComment.bind(this)
    this.getComments = this.getComments.bind(this)
  }

  createThread = async (req: Request, res: Response) => {
    try {
      const { communityId, title, content, topics } = req.validatedBody as ThreadDTO
      const mediaIds: string[] = []

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files as any[]) {
          const url = await this.storageService.uploadFile(file, 'threads')
          const media = await this.mediaRepo.save({
            url,
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
            ownerType: 'thread',
            ownerId: null,
            uploadedBy: (req as any).userId,
          })
          mediaIds.push(media._id)
        }
      }

      const threadData = {
        uid: (req as any).userId,
        communityId,
        title,
        content,
        topics: topics ?? [],
        media: mediaIds,
      }

      const thread = await this.threadRepo.create(threadData)

      if (mediaIds.length > 0) {
        await mongoose.model('Media').updateMany(
          { _id: { $in: mediaIds } },
          { ownerId: thread._id }
        )
      }

      return res.status(201).json(thread)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create thread' })
    }
  }

  getThreadsByCommunity = async (req: Request, res: Response) => {
    try {
      const { search, topics } = req.validatedQuery as ThreadQueryParams
      const threads = await this.threadRepo.findByCommunity(req.params.communityId, search, topics)
      return res.status(200).json(threads)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load threads' })
    }
  }

  getAllThreads = async (req: Request, res: Response) => {
    try {
      const { search, topics } = req.validatedQuery as ThreadQueryParams
     
      const threads = await this.threadRepo.findAll(search , topics)
      return res.status(200).json(threads)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load threads' })
    }
  }

  getThreadById = async (req: Request, res: Response) => {
    try {
      const thread = await this.threadRepo.findById(req.params.id)
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' })
      }
      return res.status(200).json(thread)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load thread' })
    }
  }

  likeThread = async (req: Request, res: Response) => {
    try {
      const thread = await this.threadRepo.toggleLike(req.params.id, (req as any).userId)
      return res.status(200).json(thread)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to like thread' })
    }
  }

  dislikeThread = async (req: Request, res: Response) => {
    try {
      const thread = await this.threadRepo.toggleDislike(req.params.id, (req as any).userId)
      return res.status(200).json(thread)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to dislike thread' })
    }
  }

  toggleCommentLike = async (req: Request, res: Response) => {
    try {
      const comment = await this.threadRepo.toggleCommentLike(req.params.commentId, (req as any).userId)
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' })
      }
      return res.status(200).json(comment)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to toggle comment like' })
    }
  }

  addComment = async (req: Request, res: Response) => {
    try {
      const { content } = req.validatedBody as ThreadCommmentDTO
      const mediaIds: string[] = []

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files as any[]) {
          const url = await this.storageService.uploadFile(file, 'comments')
          const media = await this.mediaRepo.save({
            url,
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
            ownerType: 'thread',
            ownerId: req.params.id,
            uploadedBy: (req as any).userId,
          })
          mediaIds.push(media._id)
        }
      }

      const commentData = {
        uid: (req as any).userId,
        threadId: req.params.id,
        content,
        media: mediaIds,
      }

      const comment = await this.threadRepo.addComment(commentData)
      return res.status(201).json(comment)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to add comment' })
    }
  }

  getComments = async (req: Request, res: Response) => {
    try {
      const comments = await this.threadRepo.getComments(req.params.id)
      return res.status(200).json(comments)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load comments' })
    }
  }
}

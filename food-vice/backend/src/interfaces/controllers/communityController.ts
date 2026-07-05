import { Request, Response } from 'express'
import CreateCommunity from '../../application/use-cases/community/CreateCommunity'
import GetCommunities from '../../application/use-cases/community/GetCommunities'
import JoinCommunity from '../../application/use-cases/community/JoinCommunity'
import GetJoinedCommunities from '../../application/use-cases/community/GetJoinedCommunities'
import GetRecommendedCommunities from '../../application/use-cases/community/GetRecommendedCommunities'
import { CommunityDTO } from '../../application/dtos/input/Community/CommunityDTO'
import { CommunityQueryParams } from '../../application/dtos/input/Community/CommunityQueryParams'

export default class CommunityController {
  constructor(
    private createCommunityUseCase: CreateCommunity,
    private getCommunitiesUseCase: GetCommunities,
    private getRecommendedCommunitiesUseCase: GetRecommendedCommunities,
    private joinCommunityUseCase: JoinCommunity,
    private getJoinedCommunitiesUseCase: GetJoinedCommunities,
    private communityRepo: any
  ) {
    this.createCommunity = this.createCommunity.bind(this)
    this.getCommunities = this.getCommunities.bind(this)
    this.getRecommendedCommunities = this.getRecommendedCommunities.bind(this)
    this.joinCommunity = this.joinCommunity.bind(this)
    this.getJoinedCommunities = this.getJoinedCommunities.bind(this)
    this.getCommunityById = this.getCommunityById.bind(this)
  }

  createCommunity = async (req: Request, res: Response) => {

    try {

      const userId = req.userId as string
      const community = await this.createCommunityUseCase.execute(
        userId
        , req.validatedBody as CommunityDTO
      )
      return res.status(201).json(community)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create community' })
    }
  }

  getCommunities = async (req: Request, res: Response) => {
    try {
      const communities = await this.getCommunitiesUseCase.execute(
        req.validatedQuery as CommunityQueryParams
      )
      return res.status(200).json(communities)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load communities' })
    }
  }

  getRecommendedCommunities = async (req: Request, res: Response) => {
    try {
      const communities = await this.getRecommendedCommunitiesUseCase.execute({
        userId: req.userId as string,
      })
      return res.status(200).json(communities)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load recommended communities' })
    }
  }

  joinCommunity = async (req: Request, res: Response) => {
    try {
      const membership = await this.joinCommunityUseCase.execute({
        userId: req.userId as string,
        communityId: req.params.id as string,
      })
      return res.status(200).json(membership)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to join community' })
    }
  }

  getJoinedCommunities = async (req: Request, res: Response) => {
    try {
      const communities = await this.getJoinedCommunitiesUseCase.execute({
        userId: (req as any).userId,
      })
      return res.status(200).json(communities)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load joined communities' })
    }
  }

  getCommunityById = async (req: Request, res: Response) => {
    try {
      const community = await this.communityRepo.findById(req.params.id)
      if (!community) {
        return res.status(404).json({ message: 'Community not found' })
      }
      return res.status(200).json(community)
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load community' })
    }
  }
}

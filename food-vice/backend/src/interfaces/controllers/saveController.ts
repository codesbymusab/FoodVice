import { Request, Response } from 'express'
import SaveRestaurant from '../../application/use-cases/saves/SaveRestaurant'
import SaveReel from '../../application/use-cases/saves/SaveReel'


export default class SaveController {
  constructor(
    private saveRestaurantUseCase: SaveRestaurant,
    private saveReelUseCase: SaveReel
  ) {
    this.saveRestaurant = this.saveRestaurant.bind(this)
    this.saveReel = this.saveReel.bind(this)
  }

  async saveRestaurant(req: Request, res: Response) {
    try {

      const restId=req.params.restId
      const userId=req.userId
      const result = await this.saveRestaurantUseCase.execute({restId,userId})
      
      if (result) {
        return res.status(200).json({ message: result })
      }
      return res.status(400).json({ message: 'Failed to save restaurant' })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error instanceof Error ? error.message : error })
    }
  }

  async saveReel(req: Request, res: Response) {
    try {

      const userId=req.userId
      const reelId=req.params.reelId
      const result = await this.saveReelUseCase.execute({userId,reelId})
      

      if (result) {
        return res.status(200).json({ message: result })
      }
      return res.status(400).json({ message: 'Failed to save reel' })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error instanceof Error ? error.message : error })
    }
  }
}














import { Request, Response } from 'express'
import LikeReview from '../../application/use-cases/reviews/LikeReview';
import LikeReel from '../../application/use-cases/reels/LikeReel';
import LikeReelComment from '../../application/use-cases/reels/LikeReelComment';

export default class LikeController {

    constructor(
        private likeRev: LikeReview,
        private likeReel: LikeReel,
        private likeReelComment: LikeReelComment
    ) {

        this.review = this.review.bind(this)
        this.reel = this.reel.bind(this)
        this.reelComment = this.reelComment.bind(this)

    }
    async review(req: Request, res: Response) {

        try {

            
            const userId=req.userId
            const result = await this.likeRev.execute({userId,reviewId:req.params.reviewId})

            if (result) {
                return res.status(200).json({ message: result });
            }

            return res.status(400).json({ message: result });
        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }


    }


    async reel(req: Request, res: Response) {

        try {

            
            const userId=req.userId

            const result = await this.likeReel.execute({reelId:req.params.reelId,userId})

            if (result) {
                return res.status(200).json({ message: result });
            }

            return res.status(400).json({ message: result });
        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }


    }


    async reelComment(req: Request, res: Response) {
        try {
            
            const userId= req.userId
            const result = await this.likeReelComment.execute({ commentId:req.params.commentId, userId });
            res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: err });
        }
    }
}
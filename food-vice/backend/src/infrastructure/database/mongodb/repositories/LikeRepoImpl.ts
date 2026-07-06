
import ILikeRepository from '../../../../application/interfaces/repositories/LikeRepository'
const ReviewLike = require('../models/Reviews/ReviewLikeModel')
const ReelLike = require('../models/Reels/ReelLikeModel')
const mongoose = require('mongoose')
const ReelCommentLike = require('../models/Reels/ReelCommentLikeModel')

class LikeRepoImpl implements ILikeRepository {

    async likeReview({ userId,reviewId}:{reviewId: string; userId: string }): Promise<unknown> {

        return await ReviewLike.create({

            uid: userId,
            reviewId: reviewId
        })

    }

    async unlikeReview(id: string): Promise<unknown> {

        return await ReviewLike.findByIdAndDelete({ _id: id })

    }

    async getByReviewId({ reviewId, userId } : { reviewId: string; userId: string }): Promise<unknown> {

        return await ReviewLike.findOne({
            reviewId: reviewId,
            uid: userId
        })
    }


    async likeReel({ userId, reelId } :{ userId: string; reelId: string }): Promise<unknown> {

        return await ReelLike.create({

            uid: userId,
            reelId: reelId
        })

    }

    async unlikeReel(id: string): Promise<unknown>{

        return await ReelLike.findByIdAndDelete({ _id: id })

    }

    async getByReelId({ reelId, userId } : { reelId: string; userId: string }): Promise<unknown> {

        return await ReelLike.findOne({
            reelId: reelId,
            uid: userId
        })
    }

    async toggleReelCommentLike(commentId: string, userId: string): Promise<unknown>{
        const existing = await ReelCommentLike.findOne({ cid: commentId, uid: userId });

        if (existing) {
            await ReelCommentLike.deleteOne({ _id: existing._id });
            return { liked: false };
        } else {
            await ReelCommentLike.create({ cid: commentId, uid: userId });
            return { liked: true };
        }
    }
}

export default LikeRepoImpl
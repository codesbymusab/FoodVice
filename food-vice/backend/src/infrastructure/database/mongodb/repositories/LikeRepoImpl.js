const ReviewLike = require('../models/Reviews/ReviewLikeModel')
const ReelLike = require('../models/Reels/ReelLikeModel')
const mongoose = require('mongoose')
const ReelCommentLike = require('../models/Reels/ReelCommentLikeModel')

class LikeRepoImpl {

    async likeReview({ userId, reviewId }) {

        return await ReviewLike.create({

            uid: userId,
            reviewId: reviewId
        })

    }

    async unlikeReview(id) {

        return await ReviewLike.findByIdAndDelete({ _id: id })

    }

    async getByReviewId({ reviewId, userId }) {

        return await ReviewLike.findOne({
            reviewId: reviewId,
            uid: userId
        })
    }


    async likeReel({ userId, reelId }) {

        return await ReelLike.create({

            uid: userId,
            reelId: reelId
        })

    }

    async unlikeReel(id) {

        return await ReelLike.findByIdAndDelete({ _id: id })

    }

    async getByReelId({ reelId, userId }) {

        return await ReelLike.findOne({
            reelId: reelId,
            uid: userId
        })
    }

    async toggleReelCommentLike(commentId, userId) {
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

module.exports = LikeRepoImpl
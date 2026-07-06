import ICommentRepository from '../../../../application/interfaces/repositories/CommentRepository'
const ReelCommentLike = require("../models/Reels/ReelCommentLikeModel");
const ReelComment = require("../models/Reels/ReelCommentModel");
const mongoose= require('mongoose')

class CommentRepoImpl implements ICommentRepository {


    async findByReelWithLikes(reelId: string, userId: string, limit = 20): Promise<unknown> {
        return await ReelComment.aggregate([
            { $match: { rid: new mongoose.Types.ObjectId(reelId) } },
            { $sort: { createdAt: -1 } },
            { $limit: limit },


            {
                $lookup: {
                    from: "users",
                    localField: "uid",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },


            {
                $lookup: {
                    from: "reelcommentlikes",
                    localField: "_id",
                    foreignField: "cid",
                    as: "likes"
                }
            },


            {
                $addFields: {
                    likeCount: { $size: "$likes" },
                    isLikedByUser: {
                        $gt: [
                            {
                                $size: {
                                    $filter: {
                                        input: "$likes",
                                        as: "like",
                                        cond: { $eq: ["$$like.uid", new mongoose.Types.ObjectId(userId)] }
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            },


            {
                $project: {
                    _id: 1,
                    text: 1,
                    createdAt: 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.profilePhoto": 1,
                    likeCount: 1,
                    isLikedByUser: 1
                }
            }
        ]);
    }

    async createComment(reelId: string, userId: string, text: string): Promise<unknown> {
        const comment = await ReelComment.create({
            rid: reelId,
            uid: userId,
            text
        });

        return await ReelComment.findById(comment._id)
            .populate("uid", "name profilePhoto");
    }

    
}

export default CommentRepoImpl
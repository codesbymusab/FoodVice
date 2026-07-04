import { PopularTagsParams, SuggestedAccParams, UserReelsQueryParams } from "../../application/dtos/input/Reel/ReelQueryParams";
import GetFollowerReels from "../../application/use-cases/reels/GetFollowerReels";
import GetPopularTags from "../../application/use-cases/reels/GetPopularTags";
import GetRecentReels from "../../application/use-cases/reels/GetRecentReels";
import GetReel from "../../application/use-cases/reels/GetReel";
import GetUserReels from "../../application/use-cases/reels/GetUserReels";
import SuggestAccounts from "../../application/use-cases/reels/SuggestAccounts";
import UploadReel from "../../application/use-cases/reels/UploadReel";
import { Request, Response } from 'express'
const GetReelComments = require("../../application/use-cases/reels/GetReelComments");
const PostReelComment = require("../../application/use-cases/reels/PostReelComment");
const ReelModel = require("../../infrastructure/database/mongodb/models/Reels/ReelModel");
const Reel = require("../../infrastructure/database/mongodb/models/Reels/ReelModel");
const ReelTag = require("../../infrastructure/database/mongodb/models/Reels/ReelTagModel");


export default class ReelController {
    constructor(
        private uploadReel: UploadReel,
        private getRecentReels: GetRecentReels,
        private getFollowerReels: GetFollowerReels,
        private getPopularTags: GetPopularTags,
        private getUserReels: GetUserReels,
        private getReel: GetReel,
        private suggAcc: SuggestAccounts
    ) {
        this.upload = this.upload.bind(this)
        this.recent = this.recent.bind(this)
        this.popularTags = this.popularTags.bind(this)
        this.followerReels = this.followerReels.bind(this)
        this.updateViews = this.updateViews.bind(this)
        this.userReels = this.userReels.bind(this)
        this.get = this.get.bind(this)
        this.suggestAcc = this.suggestAcc.bind(this)
    }


    async upload(req: Request, res: Response) {
        try {
            const file = req.file;

            const media = await this.uploadReel.execute({ ...req.validatedBody, file });

            return res.status(201).json(media);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err });
        }
    }


    async recent(req: Request, res: Response) {
        try {
            const limit = req.validatedQuery!.limit;
            const tag = req.validatedQuery!.tag ?? 'All'
            const cursor = req.validatedQuery!.cursor
            const userId=req.userId

            const result = await this.getRecentReels.execute({ limit, userId, tag, cursor });
            res.status(200).json({ success: true, message: "Recent Reels", ...result })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err });
        }
    }

    async followerReels(req: Request, res: Response) {
        try {
            const limit = req.validatedQuery!.limit
            const tag = req.validatedQuery!.tag ?? 'All'
            const cursor = req.validatedQuery!.cursor
            const userId=req.userId


            const result = await this.getFollowerReels.execute({ limit, userId, tag, cursor });
            res.status(200).json({ success: true, message: "Follower Reels", ...result })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err });
        }
    }

    async popularTags(req: Request, res: Response) {
        try {
            const {limit} = req.validatedQuery as PopularTagsParams

            const tags = await this.getPopularTags.execute({ limit });
            res.json(tags);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err });
        }
    }


    async updateViews(req: Request, res: Response) {
        try {
            const { reelId } = req.params;
            await ReelModel.updateOne(
                { _id: reelId },
                { $inc: { views: 1 } }
            );
            res.json({ success: true });
        } catch (err) {
            return res.status(500).json({ error: err });
        }
    }


    async userReels(req: Request, res: Response) {
        try {

            const userId = req.params.userId
            const { userCursor, savedCursor, limit } = req.validatedQuery as UserReelsQueryParams

          

            const result = await this.getUserReels.execute({ limit, userId, savedCursor, userCursor });
            res.status(200).json({ success: true, message: "User Reels", ...result })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const reelId = req.params.reelId
            const userId = req.params.userId


            const reel = await this.getReel.execute({ reelId, userId });
            res.json(reel);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err });
        }
    }



    async suggestAcc(req: Request, res: Response) {
        try {
            const { limit } = req.validatedQuery as SuggestedAccParams
            const userId=(req as any).userId

            const suggestions = await this.suggAcc.execute(userId);

            return res.status(200).json({ suggestions });
        } catch (error) {
            console.error("Error suggesting accounts:", error);
            return res.status(500).json({ error: "Failed to suggest accounts" });
        }
    }
}
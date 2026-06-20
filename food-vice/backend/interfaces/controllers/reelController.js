
const GetFollowerReels = require("../../application/use-cases/reels/GetFollowerReels");
const GetPopularTags = require("../../application/use-cases/reels/GetPopularTags");
const GetRecentReels = require("../../application/use-cases/reels/GetRecentReels");
const GetReel = require("../../application/use-cases/reels/GetReel");
const GetReelComments = require("../../application/use-cases/reels/GetReelComments");
const GetUserReels = require("../../application/use-cases/reels/GetUserReels");
const PostReelComment = require("../../application/use-cases/reels/PostReelComment");
const SuggestAccounts = require("../../application/use-cases/reels/SuggestAccounts");
const UploadReel = require("../../application/use-cases/reels/UploadReel");
const ReelModel = require("../../infrastructure/database/mongodb/models/Reels/ReelModel");
const Reel = require("../../infrastructure/database/mongodb/models/Reels/ReelModel");
const ReelTag = require("../../infrastructure/database/mongodb/models/Reels/ReelTagModel");
const MediaRepoImpl = require("../../infrastructure/database/mongodb/repositories/MediaRepoImpl");
const ReelRepoImpl = require("../../infrastructure/database/mongodb/repositories/ReelRepoImpl");
const StorageServiceImpl = require("../../infrastructure/services/FirebaseStorage/StorageServiceImp");




exports.upload = async (req, res) => {
    try {
        const file = req.file;
        const mediaRepo = new MediaRepoImpl()
        const storageService = new StorageServiceImpl()
        const reelRepo = new ReelRepoImpl()
        const uploadReel = new UploadReel(mediaRepo, reelRepo, storageService);


        const media = await uploadReel.execute({ ...req.body, file });

        return res.status(201).json(media);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}


exports.getRecent = async (req, res) => {
    try {
        const limit = req.query.limit;
        const userId = req.query.userId
        const tag = req.query.tag ?? 'All'
        const cursor = req.query.cursor
        const reelRepo = new ReelRepoImpl()
        const getRecentReels = new GetRecentReels(reelRepo)
        
        let limitNum=undefined

        if(limit && limit!=='undefined'){
            limitNum=Number.parseInt(limit)
            if(Number.isNaN(limitNum)){
                limitNum=undefined
            }
        }

        const result = await getRecentReels.execute({ limit:limitNum, userId, tag, cursor });

        res.status(200).json({success:true,message:"Recent Reels",...result})
    } catch (err) {
        console.error(err);
        return res.status(500).json({success:false , message: err.message });
    }
}

exports.getFollowers = async (req, res) => {
    try {
        const limit = req.query.limit
        const userId = req.query.userId
        const tag = req.query.tag ?? 'All'
        const cursor = req.query.cursor
        const reelRepo = new ReelRepoImpl()
        const getRecentReels = new GetFollowerReels(reelRepo)
        const result = await getRecentReels.execute({ limit:limitNum, userId, tag, cursor });
       res.status(200).json({success:true,message:"Follower Reels",...result})
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success:false, message: err.message });
    }
}

exports.getPopularTags = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const reelRepo = new ReelRepoImpl()
        const getPopularTagsUseCase = new GetPopularTags(reelRepo);
        const tags = await getPopularTagsUseCase.execute({ limit });
        res.json(tags);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success:false, message: err.message });
    }
}


exports.updateViews = async (req, res) => {
    try {
        const { reelId } = req.params;
        await ReelModel.updateOne(
            { _id: reelId },
            { $inc: { views: 1 } }
        );
        res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


exports.getUserReels = async (req, res) => {
    try {
        const limit = req.query.limit;
        const userId = req.params.userId
        const cursor = req.query.cursor
        const reelRepo = new ReelRepoImpl()
        const getReels = new GetUserReels(reelRepo)

        let limitNum=undefined

        if(limit && limit!=='undefined'){
            limitNum=Number.parseInt(limit)
            if(Number.isNaN(limitNum)){
                limitNum=undefined
            }
        }

        const reels = await getReels.execute({ limit:limitNum, userId, cursor });
        res.json(reels);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

exports.getById = async (req, res) => {
    try {
        const reelId = req.params.reelId
        const userId = req.params.userId

        const reelRepo = new ReelRepoImpl()
        const getReel = new GetReel(reelRepo)
        const reel = await getReel.execute({ reelId, userId });
        res.json(reel);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}



exports.suggestAccounts = async (req, res) => {
    try {
        const { userId } = req.query;
        const limit = req.query.limit ? parseInt(req.query.limit, 5) : 5;

        const reelRepo = new ReelRepoImpl()
        const suggestAcc = new SuggestAccounts(reelRepo)
        const suggestions = await suggestAcc.execute(userId);

        return res.status(200).json({ suggestions });
    } catch (error) {
        console.error("Error suggesting accounts:", error);
        return res.status(500).json({ error: "Failed to suggest accounts" });
    }
}
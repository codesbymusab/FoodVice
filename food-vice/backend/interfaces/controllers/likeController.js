const LikeReel = require("../../application/use-cases/reels/LikeReel")
const LikeReview = require("../../application/use-cases/reviews/LikeReview")
const LikeRepoImpl = require("../../infrastructure/database/mongodb/repositories/LikeRepoImpl")
const LikeReelComment = require("../../application/use-cases/reels/LikeReelComment");
const CommentRepoImpl = require("../../infrastructure/database/mongodb/repositories/CommentRepoImpl");

exports.likeReview=async (req,res)=>{

    try{
        
        const likeRepo = new LikeRepoImpl()
        const likeRev=new LikeReview(likeRepo)
        const result=await likeRev.execute(req.body)

        if(result){
            return res.status(200).json({message: result});
        }

        return res.status(400).json({ message: result });
    }
    catch(error){
        console.error(error)
        return res.status(400).json({message:error.message})
    }
    

}


exports.likeReel=async (req,res)=>{

    try{
        
        const likeRepo = new LikeRepoImpl()
        const likeReel=new LikeReel(likeRepo)

        const result=await likeReel.execute(req.body)

        if(result){
            return res.status(200).json({message: result});
        }

        return res.status(400).json({ message: result });
    }
    catch(error){
        console.error(error)
        return res.status(400).json({message:error.message})
    }
    

}




exports.likeReelComment = async (req, res) => {
    try {
        const { commentId, userId } = req.body;
        const likeRepo = new LikeRepoImpl()
        const commentLike = new LikeReelComment(likeRepo)
        const result = await commentLike.execute({ commentId, userId });
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}
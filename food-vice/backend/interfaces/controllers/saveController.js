const SaveReel = require("../../application/use-cases/saves/SaveReel")
const SaveRestaurant = require("../../application/use-cases/saves/SaveRestaurant")
const SaveRepoImpl = require("../../infrastructure/database/mongodb/repositories/SaveRepoImpl")


exports.saveRestaurant=async (req,res)=>{

    try{
        
        const saveRepo = new SaveRepoImpl()
        const saveRest=new SaveRestaurant(saveRepo)
        const result=await saveRest.execute(req.body)

        if(result){
            return res.status(200).json({message: result});
        }

        return res.status(400).json({ message: 'Failed to save restaurant' });
    }
    catch(error){
        console.error(error)
        return res.status(400).json({message:error.message})
    }
    

}

exports.saveReel=async (req,res)=>{

    try{
        
        const saveRepo = new SaveRepoImpl()
        const saveReel=new SaveReel(saveRepo)
        const result=await saveReel.execute(req.body)

        if(result){
            return res.status(200).json({message: result});
        }

        return res.status(400).json({ message: 'Failed to save reel' });
    }
    catch(error){
        console.error(error)
        return res.status(400).json({message:error.message})
    }
    

}














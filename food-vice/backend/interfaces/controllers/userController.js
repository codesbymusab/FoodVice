const EditUser = require("../../application/use-cases/user/EditUserProfile")
const FollowUser = require("../../application/use-cases/user/FollowUser")
const GetUser = require("../../application/use-cases/user/GetUser")
const GetUserProfile = require("../../application/use-cases/user/GetUserProfile")
const UserRepoImpl = require("../../infrastructure/database/mongodb/repositories/UserRepoImpl")
const StorageServiceImpl = require("../../infrastructure/services/FirebaseStorage/StorageServiceImp")


exports.getUser=async (req,res)=>{

    try{
     
        const userRepo = new UserRepoImpl()
        const getUser=new GetUser(userRepo)
        const user=await getUser.execute({userId:req.userId})

        if(user){
            return res.status(200).json({user:user});
        }

        return res.status(400).json({ message: 'User not logged in' });
    }
    catch(error){
        console.error(error)
        if (!res.headersSent) {
            return res.status(400).json({message:error.message})
        }
    }
    

}

exports.getUserProfile=async (req,res)=>{

    try{
       
        const userRepo = new UserRepoImpl()
        const getProfile=new GetUserProfile(userRepo)
   
        const profile=await getProfile.execute({userId:req.params.userId})

        if(profile[0]){
            return res.status(200).json(profile[0]);
        }

        return res.status(400).json({ message: 'Failed to load profile' });
    }
    catch(error){
        console.error(error)
        return res.status(400).json({message:error.message})
    }
    

}

exports.editUser = async (req, res) => {
    
    try {
        const file = req.file;
        const userRepo = new UserRepoImpl()
        const storage=new StorageServiceImpl()
        const editUser = new EditUser(userRepo,storage)
        const user = await editUser.execute({...req.body,file:file})
       
        if (user) {
            return res.status(200).json({ message: 'User updated Successfully'})
        }
        return res.status(400).json({ message: 'User update failed' });
    }
    catch (error) {
        console.error(error)
        if (!res.headersSent) {
            return res.status(400).json({ message: error.message })
        }

    }



}


exports.toggleFollow= async (req, res)=> {
  try {
    const { followerId, followingId } = req.body;
    const userRepo=new UserRepoImpl()
    const followUser=new FollowUser(userRepo)
    const result = await followUser.execute({ followerId, followingId });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}


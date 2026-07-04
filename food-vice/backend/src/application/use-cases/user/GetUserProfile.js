

class GetUserProfile {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    async execute({userId}) {

        if(!userId) throw new Error('User Id required')


        return await this.userRepo.getProfile(userId);


    }
}

module.exports = GetUserProfile;
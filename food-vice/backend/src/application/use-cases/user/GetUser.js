
class GetUser {

    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    async execute(data) {

        if (!data.userId) {
            throw new Error("User Id required");
        }


        const user = await this.userRepo.getById(data.userId);
        
        if (user[0]) {
            return user[0]
        }

        throw new Error('User not found')

    }
}

module.exports = GetUser;
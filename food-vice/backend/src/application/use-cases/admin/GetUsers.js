class GetUsers {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    async execute({ role }) {
        return await this.userRepo.getUsers({ role });
    }
}

module.exports = GetUsers;
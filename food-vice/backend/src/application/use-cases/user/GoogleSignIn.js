class GoogleSignIn {

    constructor(userRepo, oAuthRepo,jwtAuthRepo) {
        this.oAuthRepo = oAuthRepo
        this.jwtAuthRepo=jwtAuthRepo
        this.userRepo=userRepo
    }

    async execute(data) {

        const userData = await this.oAuthRepo.verifyToken(data.access_token)

        if (!userData) {
            throw new Error('User not found')
        }

        let user = await this.userRepo.getByEmail(userData.email)

        if (!user) {
          
            user=await this.userRepo.create({
                name: userData.name,
                email: userData.email,
                username: `@${userData.email.slice(0,(userData.email.length-10))}`,
                provider:'google',
                profilePhoto: userData.picture
            })
        }

        if (user && user.provider === "local") {
            throw new Error("Please login using email/password");
        }

         const token = await this.jwtAuthRepo.getToken(user._id)

        return { user: { userId: user._id, name: user.name, email: user.email, username: user.username, role: user.role, banned: user.banned, banReason: user.banReason, banUntil: user.banUntil }, token: token }

    }
}

module.exports = GoogleSignIn;
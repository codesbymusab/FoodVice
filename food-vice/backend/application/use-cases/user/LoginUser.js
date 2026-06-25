const bcrypt = require('bcrypt')

class LoginUser {
    constructor(userRepo, authRepo) {
        this.userRepo = userRepo;
        this.authRepo = authRepo
    }

    async execute(data) {

        if (!data.email) {
            throw new Error("Email required");
        }

        if (!data.password) {
            throw new Error("Password required");
        }

        const { email, password } = data
        const user = await this.userRepo.getByEmail(email)

        if (!user) {
            throw new Error("User not found")
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error("Incorrect password")
        }

        const token = await this.authRepo.getToken(user._id)

        return { user: { userId: user._id, name: user.name, email: user.email, username: user.username, role: user.role, banned: user.banned, banReason: user.banReason, banUntil: user.banUntil }, token: token }

    }
}

module.exports = LoginUser;
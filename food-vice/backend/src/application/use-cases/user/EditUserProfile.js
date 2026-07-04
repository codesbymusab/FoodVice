const bcrypt = require('bcrypt')

class EditUser {
    constructor(userRepo, storageService) {
        this.userRepo = userRepo;
        this.storageService = storageService
    }

    async execute(data) {


        if (!data.provider) {
            throw new Error("Provider required");
        }

        if (!data.email) {
            throw new Error("Email required");
        }

        if (!data.name) {
            throw new Error("Name required");
        }

        if (!data.username) {
            throw new Error("Username required");
        }

        const { email } = data
        const user = await this.userRepo.getByEmail(email)

        if (!user) {
            throw new Error("User not found")
        }

        if (data.file) {
          
            const url = await this.storageService.uploadFile(data.file, "profile");

            data.profilePhoto = url
        }

        if (data.provider === 'local') {

            if (!data.password) {
                throw new Error("Password required");
            }


            const { password } = data

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new Error("Incorrect password")
            }




            if (data.newPassword && data.confirmPassword) {

                if (data.newPassword !== data.confirmPassword) {
                    throw new Error("Password not matched")
                }

                const hashedPassword = await bcrypt.hash(data.newPassword, 10);


                return await this.userRepo.update({
                    ...data,
                    password: hashedPassword
                });


            }
            return await this.userRepo.update(user, { ...data, password: user.password });
        }


        return await this.userRepo.update(user, { ...data });


    }
}

module.exports = EditUser;
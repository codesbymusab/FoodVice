import { UserProfileDTO } from "../../dtos/input/User/UserProfileDTO";
import { IUserRepository } from "../../interfaces/repositories/UserRepository";
import IStorageService from "../../interfaces/services/StorageService";

const bcrypt = require('bcrypt')

export default class EditUser {

    constructor(
        private readonly userRepo: IUserRepository, private readonly storageService: IStorageService) {

    }

    async execute(userId: string, dto: UserProfileDTO) {

        const { email } = dto
        const user = await this.userRepo.getByEmail(email)

        if (!user) {
            throw new Error("User not found")
        }

        if (dto.file) {

            const url = await this.storageService.uploadFile(dto.file, "profile");

            dto.profilePhoto = url as string
        }

        if (dto.provider === 'local') {

            if (!dto.password) {
                throw new Error("Password required");
            }


            const { password } = dto

            const match = await bcrypt.compare(password, (user as any).password);

            if (!match) {
                throw new Error("Incorrect password")
            }




            if (dto.newPassword && dto.confirmPassword) {

                if (dto.newPassword !== dto.confirmPassword) {
                    throw new Error("Password not matched")
                }

                const hashedPassword = await bcrypt.hash(dto.newPassword, 10);


                return await this.userRepo.update(
                    userId,
                    {
                        ...dto,

                        password: hashedPassword
                    }
                );


            }
            return await this.userRepo.update(userId, { ...dto, password: (user as any).password });
        }


        return await this.userRepo.update(userId, dto);


    }
}

import { IUserRepository } from "../../interfaces/repositories/UserRepository";

export default class GetUser {

    constructor(private readonly userRepo: IUserRepository) {

    }

    async execute({userId}:{userId: string}) {



        const user = await this.userRepo.getById(userId);

        if ((user as any)[0]) {
            return (user as any)[0]
        }

        throw new Error('User not found')

    }
}


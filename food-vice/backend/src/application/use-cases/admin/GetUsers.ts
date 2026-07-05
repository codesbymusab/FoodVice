import { IUserRepository } from "../../interfaces/repositories/UserRepository";

export default class GetUsers {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute({ role }: { role?: string }) {
    return await this.userRepo.getUsers({ role: role ?? "" });
  }
}

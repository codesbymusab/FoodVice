import { UserProfileDTO } from "../../dtos/input/User/UserProfileDTO";

export interface IUserRepository {

  getByEmail(email: string): Promise<unknown>;

  findById(userId: string): Promise<unknown>;

  getById(userId: string): Promise<unknown>;

  getProfile(userId: string): Promise<unknown>;

  getUsers({ role }: { role: string }): Promise<unknown>;
  setRole(userId: string, role: string): Promise<unknown>;
  banUser(userId: string, reason: string, until: Date): Promise<unknown>;
  unbanUser(userId: string): Promise<unknown>;
  create({ name,username,email,provider,password,profilePhoto }:{name:string,username:string,email:string,provider:string,password?:string,profilePhoto?:string}): Promise<unknown>;

  update(userId: string, profile: UserProfileDTO): Promise<unknown>;
  delete(user: string): Promise<unknown>;
  follow(followerId: string, followingId: string): Promise<unknown>;
}



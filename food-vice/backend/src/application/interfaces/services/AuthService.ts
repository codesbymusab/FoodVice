export default interface IAuthService {
  getToken(...args: unknown[]): Promise<unknown>;

  verifyToken(...args: unknown[]): Promise<unknown>;
}

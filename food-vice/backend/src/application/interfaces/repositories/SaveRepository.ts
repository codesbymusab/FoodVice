export default interface ISaveRepository {
  saveRestaurant(params: { userId: string; restId: string }): Promise<unknown>;

  unsaveRestaurant(id: string): Promise<unknown>;

  getByRestId(params: { restId: string; userId: string }): Promise<unknown>;

  saveReel(params: { userId: string; reelId: string }): Promise<unknown>;

  unsaveReel(id: string): Promise<unknown>;

  getByReelId(params: { reelId: string; userId: string }): Promise<unknown>;
}

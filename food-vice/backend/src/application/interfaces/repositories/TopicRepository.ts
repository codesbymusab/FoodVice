export default interface ITopicRepository {
  create(topicData: unknown): Promise<unknown>;

  findAll(): Promise<unknown>;

  findById(id: string): Promise<unknown>;

  findByIds(ids: string[]): Promise<unknown>;
}

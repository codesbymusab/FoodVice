// 
import ITopicRepository from '../../../../application/interfaces/repositories/TopicRepository'
const Topic = require('../models/Community/ThreadTopicModel');

class TopicRepoImpl implements ITopicRepository {
  async create(topicData:unknown): Promise<unknown> {
    const topic = new Topic(topicData);
    return await topic.save();
  }

  async findAll() {
    return await Topic.find().sort({ name: 1 });
  }

  async findById(id:string) {
    return await Topic.findById(id);
  }

  async findByIds(ids:string[]) {
    return await Topic.find({ _id: { $in: ids } });
  }
}

export default TopicRepoImpl;
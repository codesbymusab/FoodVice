const Topic = require('../models/Community/ThreadTopicModel');

class TopicRepoImpl {
  async create(topicData) {
    const topic = new Topic(topicData);
    return await topic.save();
  }

  async findAll() {
    return await Topic.find().sort({ name: 1 });
  }

  async findById(id) {
    return await Topic.findById(id);
  }

  async findByIds(ids) {
    return await Topic.find({ _id: { $in: ids } });
  }
}

module.exports = TopicRepoImpl;
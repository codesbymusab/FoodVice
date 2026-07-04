const mongoose=require('mongoose')

const TopicSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Topic', TopicSchema);
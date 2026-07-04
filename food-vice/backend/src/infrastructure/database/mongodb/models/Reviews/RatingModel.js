const mongoose=require('mongoose')

const RatingSchema = new mongoose.Schema({
  reviewId: { type:mongoose.Schema.Types.ObjectId, ref: 'Review' },
  food: Number,
  service: Number,
  ambience: Number,
  price: Number,
  overall: Number
});

module.exports = mongoose.model('Rating', RatingSchema);
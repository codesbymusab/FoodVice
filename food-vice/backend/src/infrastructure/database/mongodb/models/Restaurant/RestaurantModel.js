const mongoose=require('mongoose')

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  website: String,
  description: String,
  priceCategory: String,
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  flags: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
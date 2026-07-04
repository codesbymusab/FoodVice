const mongoose=require('mongoose')

const SavedRestaurantSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurantId: { type:mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
});

module.exports = mongoose.model('SavedRestaurant', SavedRestaurantSchema);
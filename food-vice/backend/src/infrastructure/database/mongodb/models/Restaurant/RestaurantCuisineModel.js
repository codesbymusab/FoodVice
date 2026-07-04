const mongoose=require('mongoose')

const RestaurantCuisineSchema = new mongoose.Schema({
  restaurantId: { type:mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  cuisineId: { type:mongoose.Schema.Types.ObjectId, ref: 'Cuisine' }
});

module.exports = mongoose.model('RestaurantCuisine', RestaurantCuisineSchema);
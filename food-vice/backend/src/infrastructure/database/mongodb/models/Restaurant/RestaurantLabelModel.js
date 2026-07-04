const mongoose=require('mongoose')

const restaurantLabelSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label",
    required: true
  }
}, { timestamps: true });


restaurantLabelSchema.index({ restaurantId: 1, labelId: 1 }, { unique: true });

module.exports=mongoose.model("RestaurantLabel", restaurantLabelSchema);
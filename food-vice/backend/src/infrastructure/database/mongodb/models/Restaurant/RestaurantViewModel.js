
const mongoose = require("mongoose");

const RestaurantViewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  viewedAt: { type: Date, default: Date.now },
  meta: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model("RestaurantView", RestaurantViewSchema);

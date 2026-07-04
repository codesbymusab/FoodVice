const mongoose=require('mongoose')

const OpeningHoursSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  day: { type: String, required: true },
  hours: { type: String, required: true } 
});


module.exports=mongoose.model('OpeningHours',OpeningHoursSchema)
const mongoose=require('mongoose')

const ServiceSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  label: { type: String, required: true }, 
  category: { type: String }               
});


module.exports=mongoose.model('Service',ServiceSchema)
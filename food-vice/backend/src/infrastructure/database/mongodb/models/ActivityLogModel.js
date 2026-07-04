const mongoose=require('mongoose')

const ActivitySchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {type:String},
  referenceId:mongoose.Schema.Types.ObjectId
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
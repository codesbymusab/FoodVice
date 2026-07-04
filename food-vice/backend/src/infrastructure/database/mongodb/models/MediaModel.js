const mongoose=require('mongoose')

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },

  type: { 
    type: String, 
    enum: ['image', 'video'], 
    required: true 
  },

  ownerType: { 
    type: String, 
    enum: ['review','user','reel', 'thread', 'restaurant'], 
    required: true 
  },

  ownerId: { 
    type:mongoose.Schema.Types.ObjectId, 
    
  },

  uploadedBy: { 
    type:mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }

}, { timestamps: true });


module.exports = mongoose.model('Media', MediaSchema);


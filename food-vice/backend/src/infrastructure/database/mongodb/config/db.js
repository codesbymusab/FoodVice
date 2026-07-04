const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true}};

exports.connectDB = async () => {

  try {
    
    await mongoose.connect(process.env.MONGODB_CONNECTION, clientOptions);

   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  catch(error){
    console.error(error)
  }
  
}

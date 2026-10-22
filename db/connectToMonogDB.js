import mongoose from "mongoose";


const connectToMonogDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log("Connected to db");
    
  } catch(err) {
    console.log("Error connecting to db", err.message);
    
  }
}

export default connectToMonogDB
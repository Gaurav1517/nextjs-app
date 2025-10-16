import mongoose from "mongoose";

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const connectionString = process.env.MONGO_URI || 'mongodb://mongodb:27017/nextjsapp';
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectMongoDB;
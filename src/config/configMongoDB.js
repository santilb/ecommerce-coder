import mongoose from "mongoose";
import "dotenv/config";

const config = {
  mongoDB: {
    URL: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@coderhouse.ai8ozim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoDB.URL, config.mongoDB.options);
    console.log("Connected to Mongo Atlas");
  } catch (error) {
    console.log("Error Conect BD Mongo Atlas", error);
  }
};
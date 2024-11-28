import mongoose from "mongoose";
import { logger } from "./loggerSetup.js";

export const connectToDatabase = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined at .env file!");
  await mongoose.connect(process.env.MONGO_URI as string);
};

mongoose.connection.on("connected", () => {
  logger.info("Connected to MongoDB database!");
});

mongoose.connection.on("error", err => {
  logger.fatal(`Failed to connect to MongoDB database: ${err}`);
});

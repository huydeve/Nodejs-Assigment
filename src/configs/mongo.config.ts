
import mongoose from "mongoose";
import { ENV_CONFIG } from "./env.config";

const MONGO_URL = ENV_CONFIG.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("Mongoose connection ready!");
});

mongoose.connection.on("error", (err: any) => {
  console.log(err);
});

async function mongoConnect() {
  if (MONGO_URL) return await mongoose.connect(MONGO_URL);
  return console.log("Not url");
}

async function mongoDisconnect() {
  return await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };

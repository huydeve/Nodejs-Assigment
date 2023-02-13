import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

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

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const nationSchema = new Schema(
  {
    flagNation: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Nations = mongoose.model("Nations", nationSchema);

export default Nations;

import mongoose from "mongoose";

const Schema = mongoose.Schema;
export interface INation {
  image: string;
  name: string;
  description: string;

}
const nationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type:String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Nations = mongoose.model<INation>("Nations", nationSchema);

export default Nations;

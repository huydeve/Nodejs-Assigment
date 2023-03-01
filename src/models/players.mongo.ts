import mongoose from "mongoose";

const Schema = mongoose.Schema;
export interface IPlayer {
  name: string;
  image: string;
  club: string;
  position: string;
  goals: string;
  isCaptain: boolean;
  nation: string;
}
const playersSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    club: {
      type: String,
      require: true,
    },
    nation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nations',
      required: true,
    },
    position: {
      type: String,
      require: true,
    },
    goals: {
      type: Number,
      require: true,
    },
    isCaptain: {
      type: Boolean,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Players = mongoose.model<IPlayer>("Players", playersSchema);

export default Players;

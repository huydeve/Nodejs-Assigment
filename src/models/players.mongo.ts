import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    nation:{
      type: String,
      require: true,
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

const Players = mongoose.model("Players", playersSchema);

export default Players;

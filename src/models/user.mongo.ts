import mongoose from "mongoose";
const Schema = mongoose.Schema;
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  password: string;
  name: string;
  email: string;
  yob: Date;
  phone: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const usersSchema = new Schema(
  {
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    yob: {
      type: Date,
      require: true,
    },
    email: {
      type: String,
      require: false,
      unique: true,
      default: ''
    },
    phone: {
      type: String,
      require: false,
      unique: true,
      default: ''
    },
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model<IUser>("Users", usersSchema);

export default Users;

import mongoose from "mongoose";
import { IUser } from "./user.model";

interface ILink extends Document {
  hash: string;
  userId: IUser | mongoose.Types.ObjectId;
}

const linkSchema = new mongoose.Schema({
  hash: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

const Link = mongoose.model<ILink>("Link", linkSchema);
export default Link;

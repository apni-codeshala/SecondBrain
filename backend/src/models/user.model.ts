import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET || "";
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  share: boolean;
  comparePassword(password: string): boolean;
  genJWT(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    share: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    if (typeof this.password === "string") {
      const SALT = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, SALT);
    }
  }
  next();
});

userSchema.methods.comparePassword = function compare(
  password: string,
): boolean {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.genJWT = function generate(): string {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      share: this.share,
    },
    SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;

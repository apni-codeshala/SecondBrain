import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URL: string = process.env.DB_URI || "";
if (!DB_URL) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

const connect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Connection of db failed", error);
  }
};

export default connect;

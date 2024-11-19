import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { Types } from "mongoose";
dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET || "";
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

declare global {
  namespace Express {
    export interface Request {
      user?: string | Types.ObjectId;
      share?: boolean;
    }
  }
}

export interface TokenResponse {
  id: string;
  email: string;
  username: string;
  share: boolean;
}

const verifyToken = (token: string): TokenResponse | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenResponse;
    return decoded;
  } catch (err) {
    return null;
  }
};

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token = req.headers["authorization"];

  if (!token) {
    res.json({
      code: 401,
      message: "Token not found, user want to login first",
    });
    return;
  }

  const response = verifyToken(token);

  if (!response) {
    res.json({
      code: 401,
      message: "Token not verified",
    });
    return;
  }

  try {
    const user = await User.findById(response.id);

    req.user = user?.id;
    req.share = user?.share;
    next();
  } catch (err) {
    res.json({
      code: 401,
      message: "User not found",
    });
  }
};

export default isAuthenticated;

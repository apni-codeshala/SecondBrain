import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotev from "dotenv";
dotev.config();

import { signUpSchema } from "../schema/signup.schema";
import User from "../models/user.model";
import Link from "../models/link.model";
import { createShareLink } from "./link.controller";
import { TokenResponse } from "../middlewares/auth.validator";

const SECRET_KEY: string = process.env.JWT_SECRET || "";
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const testing = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Server is working properly",
  });
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    signUpSchema.parse({ username, email, password });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(411).json({
        success: false,
        error: err.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Internal server error while validating data.",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(403).json({
        success: false,
        message: "User already exists. Please use a different email.",
      });
    }
    const user = await User.create({ username, email, password });
    res.status(200).json({
      success: true,
      message: "User signed up successfully!",
      data: user,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during user creation.",
    });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(403).json({
        success: false,
        message: "Incorrect credentials",
      });
      return;
    }

    const token = user.genJWT();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifytoken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(400).json({
        success: false,
        message: "Token not provided",
      });
      return;
    }
    const decoded = jwt.verify(token, SECRET_KEY) as TokenResponse;
    res.status(200).json({
      success: true,
      message: "Successfully verified token",
      data: decoded,
    });
  } catch (error) {
    console.error("Error in token verification:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const makeSharingOn = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User ID is missing from the request",
      });
      return;
    }

    const user = await User.findById(req.user);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    let shareableLink;
    const existingLink = await Link.findOne({ userId: req.user });

    if (existingLink) {
      shareableLink = `${existingLink.hash}`;
    } else {
      shareableLink = await createShareLink(req.user, req);
    }

    user.share = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sharing is now enabled",
      link: shareableLink,
    });
  } catch (error) {
    console.error("Error in makeSharingOn:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const makeSharingOff = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: "User ID is missing from the request",
      });
      return;
    }

    const user = await User.findById(req.user);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    user.share = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sharing is now disabled",
    });
  } catch (error) {
    console.error("Error in makeSharingOff:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

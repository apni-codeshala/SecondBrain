import { Types } from "mongoose";
import crypto from "crypto";
import { Request, Response } from "express";

import Link from "../models/link.model";
import Content from "../models/content.model";
import { IUser } from "../models/user.model";

export const createShareLink = async (
  userId: string | Types.ObjectId,
  req: Request,
) => {
  try {
    const hash = crypto.randomBytes(16).toString("hex");
    const shareLink = new Link({
      hash,
      userId,
    });
    await shareLink.save();
    const shareableLink = `${hash}`;
    return shareableLink;
  } catch (error) {
    console.error("Error creating shareable link:", error);
    throw new Error("Unable to create sharable link");
  }
};

export const getContentFromLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { shareLink } = req.params;

    const link = await Link.findOne({ hash: shareLink }).populate("userId");

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Invalid or expired link",
      });
      return;
    }

    const user = link.userId as IUser;

    if (!user.share) {
      res.status(403).json({
        success: false,
        message: "User has not enabled sharing",
      });
      return;
    }

    const userContents = await Content.find({ userId: link.userId });

    res.status(200).json({
      success: true,
      data: userContents,
    });
  } catch (error) {
    console.error("Error fetching content by share link:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

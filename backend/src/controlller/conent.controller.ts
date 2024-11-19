import { Request, Response } from "express";
import { Types } from "mongoose";

import Content from "../models/content.model";
import Link from "../models/link.model";
import Tag from "../models/tags.model";
import { unfurl } from "unfurl.js";

export const getUseContents = async (
  userid: string | Types.ObjectId,
): Promise<any> => {
  try {
    const userContents = await Content.find({ userId: userid }).populate(
      "tags",
    );
    return userContents;
  } catch (error) {
    console.error("Error in finding user content:", error);
    throw new Error("Unable to fetch user content");
  }
};

export const getAllUserContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user as string | Types.ObjectId;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is missing",
      });
      return;
    }

    const userContents = await getUseContents(userId);

    res.status(200).json({
      success: true,
      message: "User content fetched successfully",
      data: userContents,
    });
  } catch (error) {
    console.error("Error in getAllUserContent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const newContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { link, type, title, tags } = req.body;

    const userId = req.user;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const tagIds = await Promise.all(
      tags.map(async (tagTitle: string) => {
        let tag = await Tag.findOne({ title: tagTitle.toLowerCase() });
        if (!tag) {
          tag = new Tag({ title: tagTitle.toLowerCase() });
          await tag.save();
        }
        return tag._id;
      }),
    );

    const content = new Content({
      link,
      type,
      title,
      tags: tagIds,
      userId,
    });

    await content.save();

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user;
    const content = await Content.findOne({ _id: id, userId });

    if (!content) {
      res.status(404).json({
        success: false,
        message: "Content not found or not authorized to delete",
      });
      return;
    }

    await Content.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const contentMetadata = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({
      success: false,
      message: "URL is required",
    });
    return;
  }
  try {
    const metadata = await unfurl(url);
    res.json({
      success: true,
      message: "Successfully getted metadata",
      data: {
        title: metadata.title,
        description: metadata.description,
        image: metadata?.open_graph,
      },
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch metadata",
    });
  }
};

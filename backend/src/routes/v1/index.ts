import express from "express";
import { z } from "zod";

import User from "../../models/user.model.js";
import { signUpSchema } from "../../schema/signup.schema";
import {
  makeSharingOff,
  makeSharingOn,
  signIn,
  signUp,
  testing,
  verifytoken,
} from "../../controlller/user.controller";
import isAuthenticated from "../../middlewares/auth.validator";
import {
  contentMetadata,
  deleteContent,
  getAllUserContent,
  newContent,
} from "../../controlller/conent.controller.js";
import { getContentFromLink } from "../../controlller/link.controller.js";

const router = express.Router();

// Server status
router.get("/", testing);

// Authentication
router.post("/signup", signUp);
router.post("/signin", signIn);

// Shared-link content
router.get("/brain/:shareLink", getContentFromLink);
router.post("/content/metadata", contentMetadata);

// Middleware
router.use(isAuthenticated);
router.get("/verifytoken", verifytoken);

// Content
router.post("/content", newContent);
router.delete("/content/:id", deleteContent);
router.get("/content", getAllUserContent);

// Make sharing on
router.patch("/brain/share", makeSharingOn);
router.patch("/brain/shareoff", makeSharingOff);

export default router;

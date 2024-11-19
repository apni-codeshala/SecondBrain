import mongoose, { mongo } from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "article", "audio", "pdf", "drive"],
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true },
);

const Content = mongoose.model("Content", contentSchema);
export default Content;

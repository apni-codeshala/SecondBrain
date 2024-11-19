"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contentSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
}, { timestamps: true });
const Content = mongoose_1.default.model("Content", contentSchema);
exports.default = Content;

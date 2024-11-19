"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentMetadata = exports.deleteContent = exports.newContent = exports.getAllUserContent = exports.getUseContents = void 0;
const content_model_1 = __importDefault(require("../models/content.model"));
const tags_model_1 = __importDefault(require("../models/tags.model"));
const unfurl_js_1 = require("unfurl.js");
const getUseContents = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userContents = yield content_model_1.default.find({ userId: userid }).populate("tags");
        return userContents;
    }
    catch (error) {
        console.error("Error in finding user content:", error);
        throw new Error("Unable to fetch user content");
    }
});
exports.getUseContents = getUseContents;
const getAllUserContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is missing",
            });
            return;
        }
        const userContents = yield (0, exports.getUseContents)(userId);
        res.status(200).json({
            success: true,
            message: "User content fetched successfully",
            data: userContents,
        });
    }
    catch (error) {
        console.error("Error in getAllUserContent:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllUserContent = getAllUserContent;
const newContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const tagIds = yield Promise.all(tags.map((tagTitle) => __awaiter(void 0, void 0, void 0, function* () {
            let tag = yield tags_model_1.default.findOne({ title: tagTitle.toLowerCase() });
            if (!tag) {
                tag = new tags_model_1.default({ title: tagTitle.toLowerCase() });
                yield tag.save();
            }
            return tag._id;
        })));
        const content = new content_model_1.default({
            link,
            type,
            title,
            tags: tagIds,
            userId,
        });
        yield content.save();
        res.status(201).json({
            success: true,
            message: "Content created successfully",
            data: content,
        });
    }
    catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.newContent = newContent;
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.user;
        const content = yield content_model_1.default.findOne({ _id: id, userId });
        if (!content) {
            res.status(404).json({
                success: false,
                message: "Content not found or not authorized to delete",
            });
            return;
        }
        yield content_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Content deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.deleteContent = deleteContent;
const contentMetadata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url) {
        res.status(400).json({
            success: false,
            message: "URL is required",
        });
        return;
    }
    try {
        const metadata = yield (0, unfurl_js_1.unfurl)(url);
        res.json({
            success: true,
            message: "Successfully getted metadata",
            data: {
                title: metadata.title,
                description: metadata.description,
                image: metadata === null || metadata === void 0 ? void 0 : metadata.open_graph,
            },
        });
    }
    catch (error) {
        console.error("Error fetching metadata:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch metadata",
        });
    }
});
exports.contentMetadata = contentMetadata;

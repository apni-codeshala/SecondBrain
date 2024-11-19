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
exports.getContentFromLink = exports.createShareLink = void 0;
const crypto_1 = __importDefault(require("crypto"));
const link_model_1 = __importDefault(require("../models/link.model"));
const content_model_1 = __importDefault(require("../models/content.model"));
const createShareLink = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = crypto_1.default.randomBytes(16).toString("hex");
        const shareLink = new link_model_1.default({
            hash,
            userId,
        });
        yield shareLink.save();
        const shareableLink = `${hash}`;
        return shareableLink;
    }
    catch (error) {
        console.error("Error creating shareable link:", error);
        throw new Error("Unable to create sharable link");
    }
});
exports.createShareLink = createShareLink;
const getContentFromLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shareLink } = req.params;
        const link = yield link_model_1.default.findOne({ hash: shareLink }).populate("userId");
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Invalid or expired link",
            });
            return;
        }
        const user = link.userId;
        if (!user.share) {
            res.status(403).json({
                success: false,
                message: "User has not enabled sharing",
            });
            return;
        }
        const userContents = yield content_model_1.default.find({ userId: link.userId });
        res.status(200).json({
            success: true,
            data: userContents,
        });
    }
    catch (error) {
        console.error("Error fetching content by share link:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getContentFromLink = getContentFromLink;

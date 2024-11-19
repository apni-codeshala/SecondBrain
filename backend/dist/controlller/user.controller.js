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
exports.makeSharingOff = exports.makeSharingOn = exports.verifytoken = exports.signIn = exports.signUp = exports.testing = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup_schema_1 = require("../schema/signup.schema");
const user_model_1 = __importDefault(require("../models/user.model"));
const link_model_1 = __importDefault(require("../models/link.model"));
const link_controller_1 = require("./link.controller");
const SECRET_KEY = process.env.JWT_SECRET || "";
if (!SECRET_KEY) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const testing = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is working properly",
    });
};
exports.testing = testing;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        signup_schema_1.signUpSchema.parse({ username, email, password });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
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
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(403).json({
                success: false,
                message: "User already exists. Please use a different email.",
            });
        }
        const user = yield user_model_1.default.create({ username, email, password });
        res.status(200).json({
            success: true,
            message: "User signed up successfully!",
            data: user,
        });
    }
    catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({
            success: false,
            error: "Internal server error during user creation.",
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ username });
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
    }
    catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.signIn = signIn;
const verifytoken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Token not provided",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        res.status(200).json({
            success: true,
            message: "Successfully verified token",
            data: decoded,
        });
    }
    catch (error) {
        console.error("Error in token verification:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.verifytoken = verifytoken;
const makeSharingOn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(400).json({
                success: false,
                message: "User ID is missing from the request",
            });
            return;
        }
        const user = yield user_model_1.default.findById(req.user);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        let shareableLink;
        const existingLink = yield link_model_1.default.findOne({ userId: req.user });
        if (existingLink) {
            shareableLink = `${existingLink.hash}`;
        }
        else {
            shareableLink = yield (0, link_controller_1.createShareLink)(req.user, req);
        }
        user.share = true;
        yield user.save();
        res.status(200).json({
            success: true,
            message: "Sharing is now enabled",
            link: shareableLink,
        });
    }
    catch (error) {
        console.error("Error in makeSharingOn:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.makeSharingOn = makeSharingOn;
const makeSharingOff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(400).json({
                success: false,
                message: "User ID is missing from the request",
            });
            return;
        }
        const user = yield user_model_1.default.findById(req.user);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        user.share = false;
        yield user.save();
        res.status(200).json({
            success: true,
            message: "Sharing is now disabled",
        });
    }
    catch (error) {
        console.error("Error in makeSharingOff:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.makeSharingOff = makeSharingOff;

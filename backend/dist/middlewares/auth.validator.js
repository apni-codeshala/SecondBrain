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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "";
if (!SECRET_KEY) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        return decoded;
    }
    catch (err) {
        return null;
    }
};
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.default.findById(response.id);
        req.user = user === null || user === void 0 ? void 0 : user.id;
        req.share = user === null || user === void 0 ? void 0 : user.share;
        next();
    }
    catch (err) {
        res.json({
            code: 401,
            message: "User not found",
        });
    }
});
exports.default = isAuthenticated;

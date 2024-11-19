"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "";
if (!SECRET_KEY) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    share: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
userSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
        if (typeof this.password === "string") {
            const SALT = bcryptjs_1.default.genSaltSync(10);
            this.password = bcryptjs_1.default.hashSync(this.password, SALT);
        }
    }
    next();
});
userSchema.methods.comparePassword = function compare(password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
userSchema.methods.genJWT = function generate() {
    return jsonwebtoken_1.default.sign({
        id: this._id,
        email: this.email,
        username: this.username,
        share: this.share,
    }, SECRET_KEY, {
        expiresIn: "1d",
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;

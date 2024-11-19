"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.userNameValidation = void 0;
const zod_1 = require("zod");
exports.userNameValidation = zod_1.z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must be no more than 10 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");
exports.signUpSchema = zod_1.z.object({
    username: exports.userNameValidation,
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(20, { message: "Password must be no more than 20 characters" })
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controlller/user.controller");
const auth_validator_1 = __importDefault(require("../../middlewares/auth.validator"));
const conent_controller_js_1 = require("../../controlller/conent.controller.js");
const link_controller_js_1 = require("../../controlller/link.controller.js");
const router = express_1.default.Router();
// Server status
router.get("/", user_controller_1.testing);
// Authentication
router.post("/signup", user_controller_1.signUp);
router.post("/signin", user_controller_1.signIn);
// Shared-link content
router.get("/brain/:shareLink", link_controller_js_1.getContentFromLink);
router.post("/content/metadata", conent_controller_js_1.contentMetadata);
// Middleware
router.use(auth_validator_1.default);
router.get("/verifytoken", user_controller_1.verifytoken);
// Content
router.post("/content", conent_controller_js_1.newContent);
router.delete("/content/:id", conent_controller_js_1.deleteContent);
router.get("/content", conent_controller_js_1.getAllUserContent);
// Make sharing on
router.patch("/brain/share", user_controller_1.makeSharingOn);
router.patch("/brain/shareoff", user_controller_1.makeSharingOff);
exports.default = router;

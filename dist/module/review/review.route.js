"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const enums_1 = require("../../../prisma/generated/prisma/enums");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post("/", (0, authMiddleware_1.auth)(enums_1.Role.CUSTOMER), review_controller_1.createReview);
router.get("/gear/:gearItemId", review_controller_1.getReviewsByGearItem);
exports.reviewRoutes = router;

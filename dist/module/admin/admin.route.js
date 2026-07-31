"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const enums_1 = require("../../../prisma/generated/prisma/enums");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get("/users", (0, authMiddleware_1.auth)(enums_1.Role.ADMIN), admin_controller_1.getAllUsers);
router.patch("/users/:id", (0, authMiddleware_1.auth)(enums_1.Role.ADMIN), admin_controller_1.updateUserStatus);
router.get("/gear", (0, authMiddleware_1.auth)(enums_1.Role.ADMIN), admin_controller_1.getAllGear);
router.get("/rentals", (0, authMiddleware_1.auth)(enums_1.Role.ADMIN), admin_controller_1.getAllRentals);
exports.adminRoutes = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gearItemRoutes = void 0;
const express_1 = require("express");
const gearItem_controller_1 = require("./gearItem.controller");
const router = (0, express_1.Router)();
router.get("/", gearItem_controller_1.gearItemController.getAllGear);
router.get("/:id", gearItem_controller_1.gearItemController.getGearById);
exports.gearItemRoutes = router;

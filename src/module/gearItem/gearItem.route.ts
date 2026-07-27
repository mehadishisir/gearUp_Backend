import { Router } from "express";
import { gearItemController } from "./gearItem.controller";

const router = Router();

router.get("/", gearItemController.getAllGear);
router.get("/:id", gearItemController.getGearById);

export const gearItemRoutes = router;
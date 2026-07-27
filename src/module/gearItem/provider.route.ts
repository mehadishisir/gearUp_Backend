import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import { gearItemController } from "./gearItem.controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.post("/gear", auth(Role.PROVIDER), gearItemController.createGearItem);
router.put("/gear/:id", auth(Role.PROVIDER), gearItemController.updateGearItem);
router.delete("/gear/:id", auth(Role.PROVIDER), gearItemController.deleteGearItem);

export const providerRoutes = router;
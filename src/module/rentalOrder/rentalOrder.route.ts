import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalOrderController.createRentalOrder);
router.get("/", auth(Role.CUSTOMER), rentalOrderController.getMyOrders);
router.get("/:id", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), rentalOrderController.getOrderById);

export const rentalOrderRoutes = router;
import express from "express";
import { auth } from "../../middleware/authMiddleware";
import { Role } from "../../../prisma/generated/prisma/enums";
import {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
} from "./admin.controller";

const router = express.Router();

router.get("/users", auth(Role.ADMIN), getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), updateUserStatus);
router.get("/gear", auth(Role.ADMIN), getAllGear);
router.get("/rentals", auth(Role.ADMIN), getAllRentals);

export const adminRoutes = router;
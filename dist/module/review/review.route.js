import express from "express";
import { auth } from "../../middleware/authMiddleware";
import { Role } from "../../../prisma/generated/prisma/enums";
import { createReview, getReviewsByGearItem } from "./review.controller";
const router = express.Router();
router.post("/", auth(Role.CUSTOMER), createReview);
router.get("/gear/:gearItemId", getReviewsByGearItem);
export const reviewRoutes = router;

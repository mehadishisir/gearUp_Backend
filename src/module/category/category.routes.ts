import express from "express";
import { categoryControllers } from "./category.controller";

import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", categoryControllers.getAllCategories);          
router.post("/", auth(Role.ADMIN), categoryControllers.createCategory); 

export const categoryRoutes = router;
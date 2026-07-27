import { Router } from "express";

import { Role } from "../../../prisma/generated/prisma/enums";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.post("/", auth(Role.ADMIN), categoryController.createCategory);

export const categoryRoutes = router;
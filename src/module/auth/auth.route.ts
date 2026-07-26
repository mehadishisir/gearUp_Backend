import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/authMiddleware";

const routes = Router()
routes.post("/register",authController.registerUser)
routes.post("/login",authController.logInUser)
routes.get("/me",auth("CUSTOMER", "PROVIDER", "ADMIN"),authController.getMe)
export const authRoutes = routes
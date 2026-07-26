import { Router } from "express";
import { authController } from "./auth.controller";

const routes = Router()
routes.post("/register",authController.registerUser)
routes.post("/login",authController.logInUser)

export const authRoutes = routes
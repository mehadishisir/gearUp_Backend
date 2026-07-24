import { Router } from "express";
import { authController } from "./auth.controller";

const routes = Router()
routes.post("/register",authController.registerUser)
export const authRoutes = routes
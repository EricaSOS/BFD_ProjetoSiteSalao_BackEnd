import { Router } from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = Router();

router.post("/auth/login", loginAdmin);

export default router;
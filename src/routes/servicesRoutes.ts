import { Router } from "express";
import { listServices } from "../controllers/servicesController.js";

const router = Router();

// GET /servicos
router.get("/", listServices);

export default router;
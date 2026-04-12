import { Router } from "express";
import { getAvailableTimesByProfessional } from "../controllers/professionalsController.js";

const router = Router();

router.get("/:id/available-times", getAvailableTimesByProfessional);

export default router;
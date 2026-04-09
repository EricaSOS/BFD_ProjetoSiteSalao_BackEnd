import { Router } from "express";
import {
  listProfessionalsByService,
  getAvailableTimesByProfessional
} from "../controllers/professionalsController.js";

const router = Router();

router.get("/services/:id/professionals", listProfessionalsByService);
router.get("/professionals/:id/available-times", getAvailableTimesByProfessional);

export default router;
import { Router } from "express";
import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../controllers/servicesController.js";

import { listProfessionalsByService } from "../controllers/professionalsController.js";


const router = Router();

router.get("/", listServices);
router.get("/:id/professionals", listProfessionalsByService);
router.get("/:id", getServiceById);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
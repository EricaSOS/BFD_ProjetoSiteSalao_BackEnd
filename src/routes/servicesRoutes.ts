import { Router } from "express";
import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../controllers/servicesController.js";

const router = Router();

router.get("/", listServices);
router.get("/:id", getServiceById);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
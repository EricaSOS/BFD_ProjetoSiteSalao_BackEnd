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

/**
 * @swagger
 * /services:
 *   get:
 *     summary: List all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Corte Feminino
 *                   description:
 *                     type: string
 *                     example: Corte com finalização para valorizar seu estilo.
 *                   price:
 *                     type: number
 *                     example: 80
 *                   duration:
 *                     type: integer
 *                     example: 60
 *                   imageUrl:
 *                     type: string
 *                     example: /images/services/corte-feminino.jpg
 */

router.get("/", listServices);
router.get("/:id/professionals", listProfessionalsByService);
router.get("/:id", getServiceById);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
import { Router } from "express";
import {
  listAppointments,
  createAppointment,
  cancelAppointment,
  confirmAppointment
} from "../controllers/appointmentsController.js";

const router = Router();

router.get("/appointments", listAppointments);
router.post("/appointments", createAppointment);
router.patch("/appointments/:id/confirm", confirmAppointment);
router.patch("/appointments/:id/cancel", cancelAppointment);

export default router;
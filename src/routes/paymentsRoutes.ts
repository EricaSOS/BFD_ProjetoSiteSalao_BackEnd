import { Router } from "express";
import {listPayments, createPayment, deletePayment} from "../controllers/paymentsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, listPayments);
router.post("/", authMiddleware, createPayment);
router.delete("/:id", authMiddleware, deletePayment);

export default router;
import { Router } from "express";

import {
  listPayments,
  confirmPayment,
  updatePayment,
  cancelPayment,
  reopenPayment
} from "../controllers/paymentsController.js";

import {
  paymentIdParamsSchema,
  listPaymentsQuerySchema,
  confirmPaymentSchema,
  updatePaymentSchema
} from "../validations/paymentValidation.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();

router.get( "/", authMiddleware, validateRequest(listPaymentsQuerySchema, "query"), listPayments);

router.patch("/:id/confirm", authMiddleware, validateRequest(paymentIdParamsSchema, "params"),validateRequest(confirmPaymentSchema), confirmPayment);

router.patch("/:id/cancel", authMiddleware, validateRequest(paymentIdParamsSchema, "params"),cancelPayment);

router.patch("/:id/reopen", authMiddleware, validateRequest(paymentIdParamsSchema, "params"), reopenPayment);

router.patch("/:id", authMiddleware, validateRequest(paymentIdParamsSchema, "params"), validateRequest(updatePaymentSchema), updatePayment);

export default router;
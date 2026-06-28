import { Router } from "express";
import {listExpenses, createExpense, deleteExpense} from "../controllers/expensesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, listExpenses);
router.post("/", authMiddleware, createExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
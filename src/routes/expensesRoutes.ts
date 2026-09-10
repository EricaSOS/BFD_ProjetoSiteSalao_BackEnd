import { Router } from "express";

import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from "../controllers/expensesController.js";

import {
  expenseIdParamsSchema,
  createExpenseSchema,
  updateExpenseSchema
} from "../validations/expenseValidation.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Lista as despesas
 *     description: Retorna todas as despesas cadastradas no sistema, ordenadas da mais recente para a mais antiga.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Despesas listadas com sucesso.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro ao listar despesas.
 */
router.get("/", authMiddleware, listExpenses);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Cadastra uma despesa
 *     description: Cadastra uma nova despesa administrativa. O valor aceita número ou texto no formato monetário brasileiro.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - date
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Compra de produtos"
 *               amount:
 *                 oneOf:
 *                   - type: number
 *                     example: 150.50
 *                   - type: string
 *                     example: "150,50"
 *                 description: Valor da despesa.
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *                 description: Data da despesa no formato YYYY-MM-DD.
 *     responses:
 *       201:
 *         description: Despesa cadastrada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro ao cadastrar despesa.
 */
router.post("/", authMiddleware, validateRequest(createExpenseSchema), createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Atualiza uma despesa
 *     description: Permite corrigir parcialmente a descrição, o valor ou a data de uma despesa já cadastrada.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da despesa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Compra de produtos para cabelo"
 *               amount:
 *                 oneOf:
 *                   - type: number
 *                     example: 180.50
 *                   - type: string
 *                     example: "180,50"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Despesa não encontrada.
 *       500:
 *         description: Erro ao atualizar despesa.
 */
router.patch("/:id", authMiddleware, validateRequest(expenseIdParamsSchema, "params"), validateRequest(updateExpenseSchema), updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Exclui uma despesa
 *     description: Remove definitivamente uma despesa cadastrada incorretamente.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da despesa.
 *     responses:
 *       200:
 *         description: Despesa excluída com sucesso.
 *       400:
 *         description: Identificador inválido.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Despesa não encontrada.
 *       500:
 *         description: Erro ao excluir despesa.
 */
router.delete("/:id", authMiddleware, validateRequest(expenseIdParamsSchema, "params"), deleteExpense);

export default router;
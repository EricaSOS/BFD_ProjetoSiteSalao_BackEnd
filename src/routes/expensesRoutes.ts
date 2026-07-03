import { Router } from "express";
import {listExpenses, createExpense, deleteExpense} from "../controllers/expensesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Listar despesas
 *     description: Retorna todas as despesas cadastradas no sistema.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de despesas retornada com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao listar despesas
 *
 *   post:
 *     summary: Criar despesa
 *     description: Cadastra uma nova despesa administrativa.
 *     tags: [Expenses]
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
 *                 example: Compra de produtos
 *               amount:
 *                 type: number
 *                 example: 150.50
 *               date:
 *                 type: string
 *                 example: 2026-06-30
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao criar despesa
 *
 * /expenses/{id}:
 *   delete:
 *     summary: Remover despesa
 *     description: Remove uma despesa cadastrada.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da despesa
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Despesa removida com sucesso
 *       404:
 *         description: Despesa não encontrada
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao remover despesa
 */

router.get("/", authMiddleware, listExpenses);
router.post("/", authMiddleware, createExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
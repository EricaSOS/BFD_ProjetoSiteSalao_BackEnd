import { Router } from "express";
import {listPayments, createPayment, deletePayment} from "../controllers/paymentsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Listar pagamentos
 *     description: Retorna todos os pagamentos cadastrados.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagamentos retornada com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao listar pagamentos
 *
 *   post:
 *     summary: Criar pagamento
 *     description: Cadastra um novo pagamento vinculado a um profissional.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professionalId
 *               - amount
 *               - date
 *             properties:
 *               professionalId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 200.00
 *               description:
 *                 type: string
 *                 example: Comissão semanal
 *               date:
 *                 type: string
 *                 example: 2026-06-30
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao criar pagamento
 *
 * /payments/{id}:
 *   delete:
 *     summary: Remover pagamento
 *     description: Remove um pagamento cadastrado.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pagamento
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Pagamento removido com sucesso
 *       404:
 *         description: Pagamento não encontrado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao remover pagamento
 */

router.get("/", authMiddleware, listPayments);
router.post("/", authMiddleware, createPayment);
router.delete("/:id", authMiddleware, deletePayment);

export default router;
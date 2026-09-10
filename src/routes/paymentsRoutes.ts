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

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lista os pagamentos
 *     description: Lista os lançamentos financeiros gerados a partir de atendimentos concluídos. Permite filtrar por status financeiro, profissional e nome do cliente.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filtra pelo status financeiro do pagamento.
 *       - in: query
 *         name: professionalId
 *         schema:
 *           type: integer
 *         description: Filtra pelo identificador do profissional responsável pelo atendimento.
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Busca pagamentos pelo nome do cliente.
 *     responses:
 *       200:
 *         description: Pagamentos listados com sucesso.
 *       400:
 *         description: Parâmetros de consulta inválidos.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro ao listar pagamentos.
 */
router.get("/", authMiddleware, validateRequest(listPaymentsQuerySchema, "query"), listPayments);

/**
 * @swagger
 * /payments/{id}/confirm:
 *   patch:
 *     summary: Confirma um pagamento pendente
 *     description: Confirma o recebimento de um pagamento vinculado a um atendimento concluído. O valor pode ser ajustado antes da confirmação. Para pagamentos combinados ou outras formas de pagamento, utilize other e informe a composição no campo description.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do pagamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *               - date
 *             properties:
 *               amount:
 *                 oneOf:
 *                   - type: number
 *                     example: 190.00
 *                   - type: string
 *                     example: "190,00"
 *                 description: Valor efetivamente recebido.
 *               paymentMethod:
 *                 type: string
 *                 enum: [pix, cash, credit_card, debit_card, other]
 *                 example: pix
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Pix 70,00 + crédito 120,00"
 *                 description: Obrigatória quando paymentMethod for other.
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *                 description: Data do recebimento no formato YYYY-MM-DD.
 *     responses:
 *       200:
 *         description: Pagamento confirmado com sucesso.
 *       400:
 *         description: Dados inválidos, pagamento já confirmado ou pagamento cancelado.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Pagamento não encontrado.
 *       500:
 *         description: Erro ao confirmar pagamento.
 */
router.patch("/:id/confirm", authMiddleware, validateRequest(paymentIdParamsSchema, "params"), validateRequest(confirmPaymentSchema), confirmPayment);

/**
 * @swagger
 * /payments/{id}/cancel:
 *   patch:
 *     summary: Cancela um lançamento financeiro
 *     description: Altera o status financeiro para cancelled, preservando o histórico do lançamento e sem alterar o status completed do atendimento correspondente.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do pagamento.
 *     responses:
 *       200:
 *         description: Pagamento cancelado com sucesso.
 *       400:
 *         description: Pagamento já está cancelado.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Pagamento não encontrado.
 *       500:
 *         description: Erro ao cancelar pagamento.
 */
router.patch("/:id/cancel", authMiddleware, validateRequest(paymentIdParamsSchema, "params"), cancelPayment);

/**
 * @swagger
 * /payments/{id}/reopen:
 *   patch:
 *     summary: Reabre um pagamento cancelado
 *     description: Altera um pagamento cancelled novamente para pending, permitindo sua revisão e posterior confirmação. Os dados financeiros anteriormente informados são preservados.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do pagamento.
 *     responses:
 *       200:
 *         description: Pagamento reaberto com sucesso.
 *       400:
 *         description: Apenas pagamentos cancelados podem ser reabertos.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Pagamento não encontrado.
 *       500:
 *         description: Erro ao reabrir pagamento.
 */
router.patch("/:id/reopen", authMiddleware, validateRequest(paymentIdParamsSchema, "params"), reopenPayment);

/**
 * @swagger
 * /payments/{id}:
 *   patch:
 *     summary: Corrige os dados de um pagamento
 *     description: Permite corrigir valor, forma de pagamento, descrição ou data. Pagamentos cancelados não podem ser alterados.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do pagamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 oneOf:
 *                   - type: number
 *                     example: 190.00
 *                   - type: string
 *                     example: "190,00"
 *               paymentMethod:
 *                 type: string
 *                 enum: [pix, cash, credit_card, debit_card, other]
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Pix 70,00 + crédito 120,00"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-10"
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso.
 *       400:
 *         description: Dados inválidos ou pagamento cancelado.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Pagamento não encontrado.
 *       500:
 *         description: Erro ao atualizar pagamento.
 */
router.patch("/:id", authMiddleware, validateRequest(paymentIdParamsSchema, "params"), validateRequest(updatePaymentSchema), updatePayment);

export default router;
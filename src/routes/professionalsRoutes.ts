import { Router } from "express";
import { getAvailableTimesByProfessional } from "../controllers/professionalsController.js";

const router = Router();

/**
 * @swagger
 * /professionals/{id}/available-times:
 *   get:
 *     summary: Listar horários disponíveis de um profissional em uma data
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do profissional
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: date
 *         required: true
 *         description: Data para consulta no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           example: 2026-04-10
 *     responses:
 *       200:
 *         description: Horários disponíveis retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: 2026-04-10
 *                 professionalId:
 *                   type: integer
 *                   example: 1
 *                 availableTimes:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "08:00"
 *                 blocked:
 *                   type: boolean
 *                   example: false
 *                 reason:
 *                   type: string
 *                   example: Professional does not work on this day.
 *       400:
 *         description: Data não informada
 *       404:
 *         description: Profissional não encontrado
 */

router.get("/:id/available-times", getAvailableTimesByProfessional);

export default router;
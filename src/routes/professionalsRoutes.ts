import { Router } from "express";
import {listProfessionals, createProfessional, deleteProfessional, listProfessionalsByService, getAvailableTimesByProfessional} from "../controllers/professionalsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

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
 * /professionals:
 *   get:
 *     summary: Lista todos os profissionais ativos
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso.
 *
 *   post:
 *     summary: Cadastra um novo profissional
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Profissional cadastrado com sucesso.
 *
 * /professionals/{id}:
 *   delete:
 *     summary: Desativa um profissional
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profissional desativado com sucesso. 
 */

router.get("/:id/available-times", getAvailableTimesByProfessional);
// Rotas administrativas protegidas
router.get("/", authMiddleware, listProfessionals);
router.post("/", authMiddleware, createProfessional);
router.delete("/professionals/:id", authMiddleware, deleteProfessional);
export default router;
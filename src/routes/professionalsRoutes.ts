import { Router } from "express";
import {listProfessionals, createProfessional, deleteProfessional, listProfessionalsByService, getAvailableTimesByProfessional} from "../controllers/professionalsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Listar profissionais
 *     description: Retorna todos os profissionais ativos ou filtra por serviço quando informado serviceId.
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         required: false
 *         description: ID do serviço para filtrar profissionais habilitados
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso
 *       500:
 *         description: Erro ao listar profissionais
 *
 *   post:
 *     summary: Criar profissional
 *     description: Cadastra um novo profissional. Rota administrativa protegida por JWT.
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ana Beatriz
 *               specialty:
 *                 type: string
 *                 example: Manicure
 *               photoUrl:
 *                 type: string
 *                 example: /images/professionals/ana.jpg
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               whatsappPhone:
 *                 type: string
 *                 example: 5591999999999
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao criar profissional
 *
 * /professionals/{id}:
 *   delete:
 *     summary: Remover profissional
 *     description: Remove ou inativa um profissional cadastrado. Rota administrativa protegida por JWT.
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do profissional
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Profissional removido com sucesso
 *       404:
 *         description: Profissional não encontrado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao remover profissional
 *
 * /professionals/{id}/available-times:
 *   get:
 *     summary: Listar horários disponíveis
 *     description: Retorna os horários disponíveis de um profissional em uma data específica.
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
 *         description: Data no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           example: 2026-06-30
 *     responses:
 *       200:
 *         description: Horários disponíveis retornados com sucesso
 *       400:
 *         description: Data não informada ou inválida
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao consultar horários disponíveis
 */

router.get("/:id/available-times", getAvailableTimesByProfessional);
// Rotas administrativas protegidas
router.get("/", authMiddleware, listProfessionals);
router.post("/", authMiddleware, createProfessional);
router.delete("/:id", authMiddleware, deleteProfessional);
export default router;
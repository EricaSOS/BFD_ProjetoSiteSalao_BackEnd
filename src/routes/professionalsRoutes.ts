import { Router } from "express";
import {
    listProfessionals,
    listAllProfessionals,
    listServicesByProfessional,
    listProfessionalSchedules, 
    createProfessional,
    updateProfessional, 
    updateProfessionalServices,
    updateProfessionalSchedulesByDay,
    deleteProfessional,
    reactivateProfessional, 
    getAvailableTimesByProfessional
} from "../controllers/professionalsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /professionals/admin:
 *   get:
 *     summary: Listar todos os profissionais para administração
 *     description: Retorna profissionais ativos e inativos. Rota administrativa protegida por JWT.
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profissionais ativos e inativos retornada com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao listar profissionais
 */
/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Listar profissionais
 *     description: Retorna todos os profissionais ativos. Rota administrativa protegida por JWT.
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profissionais ativos retornada com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
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
 *               - specialty
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
 *   patch:
 *     summary: Editar profissional
 *     description: Atualiza parcialmente os dados de um profissional ativo. Rota administrativa protegida por JWT.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ana Beatriz
 *               specialty:
 *                 type: string
 *                 example: Manicure e Pedicure
 *               photoUrl:
 *                 type: string
 *                 example: /images/professionals/ana.jpg
 *               whatsappPhone:
 *                 type: string
 *                 example: 5591999999999
 *               rating:
 *                 type: number
 *                 example: 4.9
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Profissional ativo não encontrado
 *       500:
 *         description: Erro ao atualizar profissional
 *
 *   delete:
 *     summary: Inativar profissional
 *     description: Inativa um profissional cadastrado. Rota administrativa protegida por JWT.
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
 *         description: Profissional inativado com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao inativar profissional
 *
 * /professionals/{id}/reactivate:
 *   patch:
 *     summary: Reativar profissional
 *     description: Reativa um profissional anteriormente inativado. Rota administrativa protegida por JWT.
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
 *         description: Profissional reativado com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Profissional inativo não encontrado
 *       500:
 *         description: Erro ao reativar profissional
 * /professionals/{id}/services:
 *   get:
 *     summary: Listar serviços do profissional
 *     description: Retorna os serviços vinculados a um profissional. Rota administrativa protegida por JWT.
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
 *         description: Serviços vinculados ao profissional retornados com sucesso
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao listar serviços do profissional
 *
 *   put:
 *     summary: Atualizar serviços do profissional
 *     description: Substitui os vínculos atuais do profissional pelos serviços informados. Rota administrativa protegida por JWT.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceIds
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 4]
 *     responses:
 *       200:
 *         description: Serviços do profissional atualizados com sucesso
 *       400:
 *         description: Lista de serviços inválida ou serviço inexistente/inativo
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao atualizar serviços do profissional
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

// Rotas administrativas protegidas
router.get("/admin", authMiddleware, listAllProfessionals);

router.get("/", authMiddleware, listProfessionals);
router.post("/", authMiddleware, createProfessional);

router.get("/:id/services", authMiddleware, listServicesByProfessional);
router.put("/:id/services", authMiddleware, updateProfessionalServices);

router.get("/:id/schedules", authMiddleware, listProfessionalSchedules);
router.patch("/:id/schedules/:dayOfWeek", authMiddleware, updateProfessionalSchedulesByDay);

router.get("/:id/available-times", getAvailableTimesByProfessional);

router.patch("/:id/reactivate", authMiddleware, reactivateProfessional);
router.patch("/:id", authMiddleware, updateProfessional);
router.delete("/:id", authMiddleware, deleteProfessional);

export default router;
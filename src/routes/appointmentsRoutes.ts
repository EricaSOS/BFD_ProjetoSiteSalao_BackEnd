import { validateRequest } from "../middlewares/validateRequest.js";
import { 
    createAppointmentSchema, 
    appointmentIdParamsSchema, 
    cancelAppointmentSchema,
    listAppointmentsQuerySchema, 
    dailyScheduleQuerySchema,
    changeAppointmentProfessionalSchema
    } from "../validations/appointmentValidation.js";
import { Router } from "express";
import {
    listAppointments, 
    createAppointment, 
    cancelAppointment, 
    confirmAppointment, 
    completeAppointment, 
    getDailySchedule,
    changeAppointmentProfessional
    } from "../controllers/appointmentsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar agendamentos com filtros opcionais
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         description: Filtrar por data
 *         schema:
 *           type: string
 *           example: 2026-04-10
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: Data inicial do período no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           example: 2026-09-01
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: Data final do período no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           example: 2026-09-30
 *       - in: query
 *         name: professionalId
 *         required: false
 *         description: Filtrar por ID do profissional
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filtrar por status do agendamento
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - completed
 *             - cancelled
 *           example: pending
 *       - in: query
 *         name: client
 *         required: false
 *         description: Buscar agendamentos pelo nome do cliente
 *         schema:
 *           type: string
 *           example: Fulano       
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *       400:
 *         description: Filtros inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - clientPhone
 *               - serviceId
 *               - professionalId
 *               - date
 *               - time
 *             properties:
 *               clientName:
 *                 type: string
 *                 example: Érica Santos
 *               clientPhone:
 *                 type: string
 *                 example: "91999999999"
 *               clientEmail:
 *                 type: string
 *                 example: erica@email.com
 *               serviceId:
 *                 type: integer
 *                 example: 1
 *               professionalId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 example: 2026-04-10
 *               time:
 *                 type: string
 *                 example: "09:00"
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos, horário fora da jornada, profissional indisponível, salão fechado ou horário já ocupado
 *       404:
 *         description: Serviço ou profissional não encontrado
 */

/**
 * @swagger
 * /appointments/{id}/confirm:
 *   patch:
 *     summary: Confirmar um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Agendamento confirmado com sucesso
 *       400:
 *         description: ID inválido ou agendamento não está pendente
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Agendamento não encontrado
 */

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancelar um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 example: Cliente desistiu
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *       400:
 *         description: ID inválido, dados inválidos, agendamento já cancelado ou atendimento já realizado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Agendamento não encontrado 
*/
/**
 * @swagger
 * /schedule/day:
 *   get:
 *     summary: Obter agenda do dia agrupada por profissional
 *     description: Retorna os agendamentos pendentes, confirmados e realizados do dia, agrupados por profissional.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         description: Data da agenda no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           example: 2026-04-10
 *     responses:
 *       200:
 *         description: Agenda do dia retornada com sucesso
 *       400:
 *         description: Data não informada
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
/**
 * @swagger
 * /appointments/{id}/complete:
 *   patch:
 *     summary: Marcar um atendimento como realizado
 *     description: Marca como realizado um agendamento previamente confirmado. Rota administrativa protegida por JWT.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Atendimento marcado como realizado com sucesso
 *       400:
 *         description: ID inválido ou agendamento não está no status confirmado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao marcar atendimento como realizado
 */
/**
 * @swagger
 * /appointments/{id}/professional:
 *   patch:
 *     summary: Alterar profissional do atendimento
 *     description: >
 *       Altera o profissional responsável por um agendamento pendente ou
 *       confirmado. O novo profissional deve estar ativo, realizar o serviço
 *       agendado, possuir horário de trabalho compatível e estar disponível
 *       na data e horário do atendimento.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: integer
 *           example: 25
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professionalId
 *             properties:
 *               professionalId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Profissional alterado com sucesso
 *       400:
 *         description: >
 *           Alteração não permitida, profissional incompatível com o serviço,
 *           fora do horário de trabalho, indisponível ou já ocupado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Agendamento ou profissional não encontrado
 *       500:
 *         description: Erro ao alterar profissional
 */

router.get("/appointments", authMiddleware, validateRequest(listAppointmentsQuerySchema, "query"), listAppointments);
router.post("/appointments", validateRequest(createAppointmentSchema), createAppointment);
router.patch("/appointments/:id/confirm", authMiddleware, validateRequest(appointmentIdParamsSchema, "params"), confirmAppointment);
router.patch("/appointments/:id/cancel", authMiddleware, validateRequest(appointmentIdParamsSchema,"params"), validateRequest(cancelAppointmentSchema), cancelAppointment);
router.patch("/appointments/:id/complete", authMiddleware, validateRequest(appointmentIdParamsSchema, "params"), completeAppointment);
router.patch("/appointments/:id/professional", authMiddleware, validateRequest(appointmentIdParamsSchema, "params"), validateRequest(changeAppointmentProfessionalSchema), changeAppointmentProfessional);
router.get("/schedule/day", authMiddleware, validateRequest(dailyScheduleQuerySchema, "query"), getDailySchedule);

export default router;
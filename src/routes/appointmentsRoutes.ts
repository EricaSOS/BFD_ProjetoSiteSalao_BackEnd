import { Router } from "express";
import {
  listAppointments,
  createAppointment,
  cancelAppointment,
  confirmAppointment,
  getDailySchedule
} from "../controllers/appointmentsController.js";

const router = Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar agendamentos com filtros opcionais
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         description: Filtrar por data
 *         schema:
 *           type: string
 *           example: 2026-04-10
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
 *           example: pending
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
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
 *         description: Dados inválidos ou horário indisponível
 *       404:
 *         description: Serviço ou profissional não encontrado
 */

/**
 * @swagger
 * /appointments/{id}/confirm:
 *   patch:
 *     summary: Confirmar um agendamento
 *     tags: [Appointments]
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
 *       404:
 *         description: Agendamento não encontrado
 *       400:
 *         description: Agendamento já confirmado ou cancelado
 */

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancelar um agendamento
 *     tags: [Appointments]
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
 *       404:
 *         description: Agendamento não encontrado
 *       400:
 *         description: Agendamento já cancelado
 */

/**
 * @swagger
 * /schedule/day:
 *   get:
 *     summary: Obter agenda do dia agrupada por profissional
 *     tags: [Schedule]
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
 */

router.get("/appointments", listAppointments);
router.post("/appointments", createAppointment);
router.patch("/appointments/:id/confirm", confirmAppointment);
router.patch("/appointments/:id/cancel", cancelAppointment);
router.get("/schedule/day", getDailySchedule);

export default router;
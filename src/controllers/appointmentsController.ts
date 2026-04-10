import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listAppointments(req: Request, res: Response) {
  try {
    const { date, professionalId, status } = req.query;

    const db = await getDb();

    let query = `SELECT * FROM agendamentos WHERE 1=1`;
    const params: any[] = [];

    if (date) {
      query += ` AND data = ?`;
      params.push(date);
    }

    if (professionalId) {
      query += ` AND profissional_id = ?`;
      params.push(professionalId);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY data, horario`;

    const appointments = await db.all(query, params);

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error listing appointments:", error);
    return res.status(500).json({
      error: "Error listing appointments."
    });
  }
}

export async function createAppointment(req: Request, res: Response) {
  try {
    const {
      cliente_nome,
      cliente_telefone,
      cliente_email,
      servico_id,
      profissional_id,
      data,
      horario
    } = req.body;

    if (
      !cliente_nome ||
      !cliente_telefone ||
      !servico_id ||
      !profissional_id ||
      !data ||
      !horario
    ) {
      return res.status(400).json({
        error:
          "Required fields: cliente_nome, cliente_telefone, servico_id, profissional_id, data, horario."
      });
    }

    const db = await getDb();

    const service = await db.get(
      `SELECT * FROM servicos WHERE id = ? AND ativo = 1`,
      [servico_id]
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    const professional = await db.get(
      `SELECT * FROM profissionais WHERE id = ? AND ativo = 1`,
      [profissional_id]
    );

    if (!professional) {
      return res.status(404).json({ error: "Professional not found." });
    }

    const professionalService = await db.get(
      `SELECT * FROM profissional_servico
       WHERE profissional_id = ? AND servico_id = ?`,
      [profissional_id, servico_id]
    );

    if (!professionalService) {
      return res.status(400).json({
        error: "This professional does not provide the selected service."
      });
    }

    const conflictingAppointment = await db.get(
      `SELECT * FROM agendamentos
       WHERE profissional_id = ?
         AND data = ?
         AND horario = ?
         AND status IN ('pending', 'confirmed')`,
      [profissional_id, data, horario]
    );

    if (conflictingAppointment) {
      return res.status(400).json({
        error: "This time slot is no longer available."
      });
    }

    const whatsappMessage =
`Olá! Gostaria de confirmar meu agendamento.

*Detalhes do Agendamento*
Serviço: ${service.nome}
Profissional: ${professional.nome}
Data: ${data}
Horário: ${horario}
Valor: R$ ${service.preco}

*Meus Dados*
Nome: ${cliente_nome}
Telefone: ${cliente_telefone}
E-mail: ${cliente_email ?? "Não informado"}`;

    const createdAt = new Date().toISOString();

    const result = await db.run(
      `INSERT INTO agendamentos (
        cliente_nome,
        cliente_telefone,
        cliente_email,
        servico_id,
        profissional_id,
        servico_nome,
        profissional_nome,
        data,
        horario,
        valor,
        status,
        mensagem_whatsapp,
        criado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_nome,
        cliente_telefone,
        cliente_email ?? null,
        servico_id,
        profissional_id,
        service.nome,
        professional.nome,
        data,
        horario,
        service.preco,
        "pending",
        whatsappMessage,
        createdAt
      ]
    );

    const newAppointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [result.lastID]
    );

    return res.status(201).json({
      message: "Appointment created successfully.",
      appointment: newAppointment,
      summary: {
        serviceName: service.nome,
        professionalName: professional.nome,
        date: data,
        time: horario,
        price: service.preco
      },
      whatsappMessage
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({
      error: "Error creating appointment."
    });
  }
}

export async function confirmAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const db = await getDb();

    const appointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [id]
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        error: "Cancelled appointments cannot be confirmed."
      });
    }

    if (appointment.status === "confirmed") {
      return res.status(400).json({
        error: "Appointment is already confirmed."
      });
    }

    await db.run(
      `UPDATE agendamentos
       SET status = ?
       WHERE id = ?`,
      ["confirmed", id]
    );

    const updatedAppointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: "Appointment confirmed successfully.",
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    return res.status(500).json({
      error: "Error confirming appointment."
    });
  }
}

export async function cancelAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { motivo_cancelamento } = req.body;

    const db = await getDb();

    const appointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [id]
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        error: "Appointment is already cancelled."
      });
    }

    const cancelledAt = new Date().toISOString();

    await db.run(
      `UPDATE agendamentos
       SET status = ?, cancelado_em = ?, motivo_cancelamento = ?
       WHERE id = ?`,
      [
        "cancelled",
        cancelledAt,
        motivo_cancelamento ?? null,
        id
      ]
    );

    const updatedAppointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: "Appointment cancelled successfully.",
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      error: "Error cancelling appointment."
    });
  }
}

export async function getDailySchedule(req: Request, res: Response) {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({
        error: "The query parameter 'date' is required."
      });
    }

    const db = await getDb();

    // 1. Buscar profissionais ativos
    const professionals = await db.all(
      `SELECT id, nome FROM profissionais WHERE ativo = 1`
    );

    // 2. Buscar agendamentos do dia
    const appointments = await db.all(
      `SELECT *
       FROM agendamentos
       WHERE data = ?
         AND status IN ('pending', 'confirmed')
       ORDER BY horario`,
      [date]
    );

    // 3. Organizar por profissional
    const schedule = professionals.map((professional: any) => {
      const professionalAppointments = appointments
        .filter(
          (appt: any) => appt.profissional_id === professional.id
        )
        .map((appt: any) => ({
          id: appt.id,
          horario: appt.horario,
          cliente_nome: appt.cliente_nome,
          servico_nome: appt.servico_nome,
          status: appt.status
        }));

      return {
        id: professional.id,
        nome: professional.nome,
        appointments: professionalAppointments
      };
    });

    return res.status(200).json({
      date,
      professionals: schedule
    });

  } catch (error) {
    console.error("Error fetching daily schedule:", error);
    return res.status(500).json({
      error: "Error fetching daily schedule."
    });
  }
}
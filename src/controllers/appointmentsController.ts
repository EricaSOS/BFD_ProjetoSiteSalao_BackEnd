import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listAppointments(req: Request, res: Response) {
  try {
    const { date, professionalId, status } = req.query;

    const db = await getDb();

    let query = `SELECT * FROM appointments WHERE 1=1`;
    const params: any[] = [];

    if (date) {
      query += ` AND date = ?`;
      params.push(date);
    }

    if (professionalId) {
      query += ` AND professional_id = ?`;
      params.push(professionalId);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY date, time`;

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
      clientName,
      clientPhone,
      clientEmail,
      serviceId,
      professionalId,
      date,
      time
    } = req.body;

    if (
      !clientName ||
      !clientPhone ||
      !serviceId ||
      !professionalId ||
      !date ||
      !time
    ) {
      return res.status(400).json({
        error:
          "Required fields: clientName, clientPhone, serviceId, professionalId, date, time."
      });
    }

    const db = await getDb();

    const service = await db.get(
      `SELECT * FROM services WHERE id = ? AND is_active = 1`,
      [serviceId]
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    const professional = await db.get(
      `SELECT * FROM professionals WHERE id = ? AND is_active = 1`,
      [professionalId]
    );

    if (!professional) {
      return res.status(404).json({ error: "Professional not found." });
    }

    const professionalService = await db.get(
      `SELECT * FROM professional_services
       WHERE professional_id = ? AND service_id = ?`,
      [professionalId, serviceId]
    );

    if (!professionalService) {
      return res.status(400).json({
        error: "This professional does not provide the selected service."
      });
    }

    const conflictingAppointment = await db.get(
      `SELECT * FROM appointments
       WHERE professional_id = ?
         AND date = ?
         AND time = ?
         AND status IN ('pending', 'confirmed')`,
      [professionalId, date, time]
    );

    if (conflictingAppointment) {
      return res.status(400).json({
        error: "This time slot is no longer available."
      });
    }

    const whatsappMessage =
`Olá! Gostaria de confirmar meu agendamento.

*Detalhes do Agendamento*
Serviço: ${service.name}
Profissional: ${professional.name}
Data: ${date}
Horário: ${time}
Valor: R$ ${service.price}

*Meus Dados*
Nome: ${clientName}
Telefone: ${clientPhone}
E-mail: ${clientEmail ?? "Não informado"}`;

    const createdAt = new Date().toISOString();

    const result = await db.run(
      `INSERT INTO appointments (
        client_name,
        client_phone,
        client_email,
        service_id,
        professional_id,
        service_name,
        professional_name,
        date,
        time,
        price,
        status,
        whatsapp_message,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientName,
        clientPhone,
        clientEmail ?? null,
        serviceId,
        professionalId,
        service.name,
        professional.name,
        date,
        time,
        service.price,
        "pending",
        whatsappMessage,
        createdAt
      ]
    );

    const newAppointment = await db.get(
      `SELECT * FROM appointments WHERE id = ?`,
      [result.lastID]
    );

    const whatsappLink = `https://wa.me/${professional.whatsapp_phone}?text=${encodeURIComponent(whatsappMessage)}`;

    return res.status(201).json({
      message: "Appointment created successfully.",
      appointment: newAppointment,
      summary: {
        serviceName: service.name,
        professionalName: professional.name,
        professionalPhoto: professional.photo_url,
        professionalPhone: professional.whatsapp_phone,
        date,
        time,
        price: service.price,
        duration: service.duration_minutes
      },
      whatsappMessage,
      whatsappLink
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
      `SELECT * FROM appointments WHERE id = ?`,
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
      `UPDATE appointments
       SET status = ?
       WHERE id = ?`,
      ["confirmed", id]
    );

    const updatedAppointment = await db.get(
      `SELECT * FROM appointments WHERE id = ?`,
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
    const { cancellationReason } = req.body;

    const db = await getDb();

    const appointment = await db.get(
      `SELECT * FROM appointments WHERE id = ?`,
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
      `UPDATE appointments
       SET status = ?, cancelled_at = ?, cancellation_reason = ?
       WHERE id = ?`,
      [
        "cancelled",
        cancelledAt,
        cancellationReason ?? null,
        id
      ]
    );

    const updatedAppointment = await db.get(
      `SELECT * FROM appointments WHERE id = ?`,
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

    const professionals = await db.all(
      `SELECT id, name FROM professionals WHERE is_active = 1`
    );

    const appointments = await db.all(
      `SELECT *
       FROM appointments
       WHERE date = ?
         AND status IN ('pending', 'confirmed')
       ORDER BY time`,
      [date]
    );

    const schedule = professionals.map((professional: any) => {
      const professionalAppointments = appointments
        .filter(
          (appointment: any) => appointment.professional_id === professional.id
        )
        .map((appointment: any) => ({
          id: appointment.id,
          time: appointment.time,
          clientName: appointment.client_name,
          serviceName: appointment.service_name,
          status: appointment.status
        }));

      return {
        id: professional.id,
        name: professional.name,
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
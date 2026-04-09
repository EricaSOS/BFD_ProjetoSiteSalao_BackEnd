import type { Request, Response } from "express";
import { getDb } from "../database/db.js";
import { getDayOfWeekFromDate } from "../utils/dateUtils.js";
import { generateTimeSlots, isTimeWithinRange } from "../utils/timeUtils.js";

export async function listProfessionalsByService(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const service = await db.get(
      "SELECT * FROM servicos WHERE id = ? AND ativo = 1",
      [id]
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    const professionals = await db.all(
      `SELECT p.*
       FROM profissionais p
       INNER JOIN profissional_servico ps
         ON p.id = ps.profissional_id
       WHERE ps.servico_id = ?
         AND p.ativo = 1
       ORDER BY p.nome`,
      [id]
    );

    return res.status(200).json(professionals);
  } catch (error) {
    console.error("Error fetching professionals by service:", error);
    return res.status(500).json({
      error: "Error fetching professionals by service."
    });
  }
}

export async function getAvailableTimesByProfessional(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({
        error: "The query parameter 'date' is required in format YYYY-MM-DD."
      });
    }

    const db = await getDb();

    const professional = await db.get(
      "SELECT * FROM profissionais WHERE id = ? AND ativo = 1",
      [id]
    );

    if (!professional) {
      return res.status(404).json({ error: "Professional not found." });
    }

    const dayOfWeek = getDayOfWeekFromDate(date);

    const schedules = await db.all(
      `SELECT * FROM professional_schedules
       WHERE professional_id = ?
         AND day_of_week = ?
         AND is_active = 1
       ORDER BY start_time`,
      [id, dayOfWeek]
    );

    if (!schedules || schedules.length === 0) {
      return res.status(200).json({
        date,
        professionalId: Number(id),
        availableTimes: [],
        blocked: true,
        reason: "Professional does not work on this day."
      });
    }

    let allTimeSlots: string[] = [];

    for (const schedule of schedules) {
      const slots = generateTimeSlots(
        schedule.start_time,
        schedule.end_time,
        60
      );

      allTimeSlots = [...allTimeSlots, ...slots];
    }

    const businessClosures = await db.all(
      `SELECT * FROM business_closures WHERE date = ?`,
      [date]
    );

    const professionalUnavailableDates = await db.all(
      `SELECT * FROM professional_unavailable_dates
       WHERE professional_id = ? AND date = ?`,
      [id, date]
    );

    const appointments = await db.all(
      `SELECT horario
       FROM agendamentos
       WHERE profissional_id = ?
         AND data = ?
         AND status IN ('pending', 'confirmed')`,
      [id, date]
    );

    const occupiedTimes = appointments.map(
      (appointment: { horario: string }) => appointment.horario
    );

    let availableTimes = allTimeSlots.filter(
      (time) => !occupiedTimes.includes(time)
    );

    availableTimes = availableTimes.filter((time) => {
      const blockedByBusiness = businessClosures.some((closure: any) =>
        isTimeWithinRange(time, closure.start_time, closure.end_time)
      );

      if (blockedByBusiness) return false;

      const blockedByProfessional = professionalUnavailableDates.some(
        (unavailable: any) =>
          isTimeWithinRange(time, unavailable.start_time, unavailable.end_time)
      );

      if (blockedByProfessional) return false;

      return true;
    });

    return res.status(200).json({
      date,
      professionalId: Number(id),
      availableTimes,
      blocked: false
    });
  } catch (error) {
    console.error("Error fetching available times:", error);
    return res.status(500).json({
      error: "Error fetching available times."
    });
  }
}
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
      "SELECT * FROM services WHERE id = ? AND is_active = 1",
      [id]
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    const rows = await db.all(
      `SELECT p.*
       FROM professionals p
       INNER JOIN professional_services ps
         ON p.id = ps.professional_id
       WHERE ps.service_id = ?
         AND p.is_active = 1
       ORDER BY p.name`,
      [id]
    );

    const professionals = rows.map((professional: any) => ({
      id: professional.id,
      name: professional.name,
      photo: professional.photo_url,
      specialty: professional.specialty,
      rating: professional.rating,
      whatsappPhone: professional.whatsapp_phone
    }));

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
      "SELECT * FROM professionals WHERE id = ? AND is_active = 1",
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
      `SELECT TO_CHAR(time, 'HH24:MI') AS time
      FROM appointments
      WHERE professional_id = ?
        AND date = ?
        AND status IN ('pending', 'confirmed')`,
      [id, date]
    );

    const occupiedTimes = appointments.map(
      (appointment: { time: string }) => appointment.time
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

export async function listProfessionals(req: Request, res: Response) {
  try {
    const db = await getDb();

    const professionals = await db.all(
      `SELECT *
       FROM professionals
       WHERE is_active = TRUE
       ORDER BY name`
    );

    return res.status(200).json(professionals);
  } catch (error) {
    console.error("Error listing professionals:", error);
    return res.status(500).json({
      error: "Error listing professionals."
    });
  }
}

export async function listAllProfessionals(req: Request, res: Response) {
  try {
    const db = await getDb();

    const professionals = await db.all(
      `SELECT *
       FROM professionals
       ORDER BY name`
    );

    const result = professionals.map((professional: any) => ({
      id: professional.id,
      name: professional.name,
      specialty: professional.specialty,
      photoUrl: professional.photo_url,
      whatsappPhone: professional.whatsapp_phone,
      rating: professional.rating,
      isActive: professional.is_active
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error listing all professionals:", error);

    return res.status(500).json({
      error: "Error listing professionals."
    });
  }
}

export async function listServicesByProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const professional = await db.get(
      "SELECT * FROM professionals WHERE id = ?",
      [id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Professional not found."
      });
    }

    const services = await db.all(
      `SELECT
         s.id,
         s.name,
         s.description,
         s.price,
         s.duration_minutes,
         s.image_url,
         s.is_active
       FROM services s
       INNER JOIN professional_services ps
         ON s.id = ps.service_id
       WHERE ps.professional_id = ?
       ORDER BY s.name`,
      [id]
    );

    const result = services.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration_minutes,
      imageUrl: service.image_url,
      isActive: service.is_active
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error listing services by professional:", error);

    return res.status(500).json({
      error: "Error listing professional services."
    });
  }
}

export async function createProfessional(req: Request, res: Response) {
  try {
    const { name, specialty, photoUrl, whatsappPhone, rating } = req.body;

    if (!name || !specialty) {
      return res.status(400).json({
        error: "Name and specialty are required."
      });
    }

    const db = await getDb();

    const result = await db.run(
      `INSERT INTO professionals (
        name,
        photo_url,
        whatsapp_phone,
        specialty,
        rating,
        is_active
      ) VALUES (?, ?, ?, ?, ?, TRUE)`,
      [
        name.trim(),
        photoUrl?.trim() || null,
        whatsappPhone?.trim() || null,
        specialty.trim(),
        rating ?? 5
      ]
    );

    return res.status(201).json({
      message: "Professional created successfully.",
      id: result.lastID
    });
  } catch (error) {
    console.error("Error creating professional:", error);
    return res.status(500).json({
      error: "Error creating professional."
    });
  }
}

export async function updateProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      name,
      specialty,
      photoUrl,
      whatsappPhone,
      rating
    } = req.body;

    const db = await getDb();

    const existingProfessional = await db.get(
      "SELECT * FROM professionals WHERE id = ? AND is_active = TRUE",
      [id]
    );

    if (!existingProfessional) {
      return res.status(404).json({
        error: "Active professional not found."
      });
    }

    const updatedName =
      name !== undefined ? name.trim() : existingProfessional.name;

    const updatedSpecialty =
      specialty !== undefined
        ? specialty.trim()
        : existingProfessional.specialty;

    const updatedPhotoUrl =
      photoUrl !== undefined
        ? photoUrl?.trim() || null
        : existingProfessional.photo_url;

    const updatedWhatsappPhone =
      whatsappPhone !== undefined
        ? whatsappPhone?.trim() || null
        : existingProfessional.whatsapp_phone;

    const updatedRating =
      rating !== undefined ? rating : existingProfessional.rating;

    if (!updatedName || !updatedSpecialty) {
      return res.status(400).json({
        error: "Name and specialty cannot be empty."
      });
    }

    await db.run(
      `UPDATE professionals
       SET name = ?,
           specialty = ?,
           photo_url = ?,
           whatsapp_phone = ?,
           rating = ?
       WHERE id = ?`,
      [
        updatedName,
        updatedSpecialty,
        updatedPhotoUrl,
        updatedWhatsappPhone,
        updatedRating,
        id
      ]
    );

    return res.status(200).json({
      message: "Professional updated successfully."
    });
  } catch (error) {
    console.error("Error updating professional:", error);

    return res.status(500).json({
      error: "Error updating professional."
    });
  }
}

export async function deleteProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const professional = await db.get(
      "SELECT * FROM professionals WHERE id = ?",
      [id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Professional not found."
      });
    }

    await db.run(
      `UPDATE professionals
       SET is_active = FALSE
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: "Professional deactivated successfully."
    });
  } catch (error) {
    console.error("Error deleting professional:", error);
    return res.status(500).json({
      error: "Error deleting professional."
    });
  }
}

export async function reactivateProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const professional = await db.get(
      "SELECT * FROM professionals WHERE id = ? AND is_active = FALSE",
      [id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Inactive professional not found."
      });
    }

    await db.run(
      `UPDATE professionals
       SET is_active = TRUE
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: "Professional reactivated successfully."
    });
  } catch (error) {
    console.error("Error reactivating professional:", error);

    return res.status(500).json({
      error: "Error reactivating professional."
    });
  }
}

export async function updateProfessionalServices(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { serviceIds } = req.body;

    if (!Array.isArray(serviceIds)) {
      return res.status(400).json({
        error: "serviceIds must be an array."
      });
    }

    const normalizedServiceIds = [
      ...new Set(
        serviceIds.map(Number)
      )
    ];

    const hasInvalidId = normalizedServiceIds.some(
      (serviceId) =>
        !Number.isInteger(serviceId) || serviceId <= 0
    );

    if (hasInvalidId) {
      return res.status(400).json({
        error: "All service IDs must be valid integers."
      });
    }

    const db = await getDb();

    const professional = await db.get(
      `SELECT id
       FROM professionals
       WHERE id = ?`,
      [id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Professional not found."
      });
    }

    if (normalizedServiceIds.length > 0) {
      const services = await db.all(
        `SELECT id
         FROM services
         WHERE id = ANY(?::int[])
           AND is_active = TRUE`,
        [normalizedServiceIds]
      );

      if (services.length !== normalizedServiceIds.length) {
        return res.status(400).json({
          error: "One or more services do not exist or are inactive."
        });
      }
    }

    await db.query(
      `WITH removed AS (
        DELETE FROM professional_services
        WHERE professional_id = ?
          AND NOT (service_id = ANY(?::int[]))
      )
      INSERT INTO professional_services (
        professional_id,
        service_id
      )
      SELECT ?, UNNEST(?::int[])
      ON CONFLICT (professional_id, service_id)
      DO NOTHING`,
      [
        id,
        normalizedServiceIds,
        id,
        normalizedServiceIds
      ]
    );

    return res.status(200).json({
      message: "Professional services updated successfully."
    });
  } catch (error) {
    console.error(
      "Error updating professional services:",
      error
    );

    return res.status(500).json({
      error: "Error updating professional services."
    });
  }
}

export async function listProfessionalSchedules(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const professional = await db.get(
      `SELECT id
       FROM professionals
       WHERE id = ?`,
      [id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Professional not found."
      });
    }

    const schedules = await db.all(
      `SELECT
         id,
         day_of_week,
         TO_CHAR(start_time, 'HH24:MI') AS start_time,
         TO_CHAR(end_time, 'HH24:MI') AS end_time,
         is_active
       FROM professional_schedules
       WHERE professional_id = ?
       ORDER BY day_of_week, start_time`,
      [id]
    );

    const result = schedules.map((schedule: any) => ({
      id: schedule.id,
      dayOfWeek: schedule.day_of_week,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      isActive: schedule.is_active
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error listing professional schedules:",
      error
    );

    return res.status(500).json({
      error: "Error listing professional schedules."
    });
  }
}

export async function updateProfessionalSchedulesByDay(
  req: Request,
  res: Response
) {
  try {
    const { id, dayOfWeek } = req.params;
    const { schedules } = req.body;

    const parsedDayOfWeek = Number(dayOfWeek);

    if (
      !Number.isInteger(parsedDayOfWeek) ||
      parsedDayOfWeek < 1 ||
      parsedDayOfWeek > 7
    ) {
      return res.status(400).json({
        error: "Day of week must be an integer between 1 and 7."
      });
    }

    if (!Array.isArray(schedules)) {
      return res.status(400).json({
        error: "Schedules must be an array."
      });
    }

    for (const schedule of schedules) {
      const { startTime, endTime } = schedule;

      if (
        typeof startTime !== "string" ||
        typeof endTime !== "string"
      ) {
        return res.status(400).json({
          error: "Start time and end time are required."
        });
      }

      if (startTime >= endTime) {
        return res.status(400).json({
          error: "Start time must be earlier than end time."
        });
      }
    }

    const db = await getDb();

    const professional = await db.get(
      `SELECT id
       FROM professionals
       WHERE id = ?`,
      [id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Professional not found."
      });
    }

    await db.query(
      `WITH removed AS (
         DELETE FROM professional_schedules
         WHERE professional_id = ?
           AND day_of_week = ?
       )
       INSERT INTO professional_schedules (
         professional_id,
         day_of_week,
         start_time,
         end_time,
         is_active
       )
       SELECT
         ?,
         ?,
         schedule.start_time::TIME,
         schedule.end_time::TIME,
         TRUE
       FROM jsonb_to_recordset(?::jsonb) AS schedule(
         start_time TEXT,
         end_time TEXT
       )`,
      [
        id,
        parsedDayOfWeek,
        id,
        parsedDayOfWeek,
        JSON.stringify(
          schedules.map((schedule) => ({
            start_time: schedule.startTime,
            end_time: schedule.endTime
          }))
        )
      ]
    );

    return res.status(200).json({
      message: "Professional schedule updated successfully."
    });
  } catch (error) {
    console.error(
      "Error updating professional schedule:",
      error
    );

    return res.status(500).json({
      error: "Error updating professional schedule."
    });
  }
}
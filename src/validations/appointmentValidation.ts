import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientName: z
  .string()
  .trim()
  .min(2, "Client name must have at least 2 characters.")
  .max(100, "Client name must have at most 100 characters.")
  .regex(
    /^[A-Za-zÀ-ÿ\s'-]+$/,
    "Client name contains invalid characters."
  ),

  clientPhone: z
    .string()
    .trim()
    .min(8, "Client phone must have at least 8 characters.")
    .max(20, "Client phone must have at most 20 characters.")
    .regex(/^[0-9+\-\s()]+$/, "Client phone contains invalid characters.")
    .refine(
         (value) => value.replace(/\D/g, "").length >= 10,
         {
            message: "Client phone must contain at least 10 digits."
         }
    ),

  clientEmail: z
    .string()
    .trim()
    .email("Client email must be valid.")
    .max(100, "Client email must have at most 100 characters.")
    .optional()
    .or(z.literal("")),

  serviceId: z
    .number()
    .int()
    .positive("Service id must be a positive integer."),

  professionalId: z
    .number()
    .int()
    .positive("Professional id must be a positive integer."),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        {
        message: "Date must be valid."
        }
    ),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format.")
});

export const appointmentIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Appointment id must be a number.")
    .transform(Number)
    .refine((value) => value > 0, {
      message: "Appointment id must be positive."
    })
});

export const cancelAppointmentSchema = z.object({
  cancellationReason: z
    .string()
    .trim()
    .max(255, "Cancellation reason must have at most 255 characters.")
    .optional()
    .or(z.literal(""))
});

export const listAppointmentsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
    .optional(),

  professionalId: z
    .string()
    .regex(/^\d+$/, "Professional id must be a number.")
    .transform(Number)
    .refine((value) => value > 0, {
      message: "Professional id must be positive."
    })
    .optional(),

  status: z
    .enum(["pending", "confirmed", "cancelled", "completed"])
    .optional()
});

export const dailyScheduleQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
});

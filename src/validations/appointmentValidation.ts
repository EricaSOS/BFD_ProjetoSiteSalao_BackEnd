import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Client name must have at least 2 characters.")
    .max(100, "Client name must have at most 100 characters."),

  clientPhone: z
    .string()
    .trim()
    .min(8, "Client phone must have at least 8 characters.")
    .max(20, "Client phone must have at most 20 characters.")
    .regex(/^[0-9+\-\s()]+$/, "Client phone contains invalid characters."),

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
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),

  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format.")
});
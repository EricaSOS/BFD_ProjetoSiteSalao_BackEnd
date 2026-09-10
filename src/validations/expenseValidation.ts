import { z } from "zod";
import { parseBrazilianMoney } from "../utils/parseBrazilianMoney.js";

const amountSchema = z
  .union([
    z.string(),
    z.number()
  ])
  .transform((value) => parseBrazilianMoney(value))
  .refine(
    (value) => Number.isFinite(value) && value > 0,
    {
      message: "Amount must be greater than zero."
    }
  );

export const expenseIdParamsSchema = z.object({
  id: z
    .string()
    .regex(
      /^\d+$/,
      "Expense id must be a number."
    )
    .transform(Number)
    .refine(
      (value) => value > 0,
      {
        message: "Expense id must be positive."
      }
    )
});

export const createExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(
      1,
      "Description is required."
    )
    .max(
      255,
      "Description must have at most 255 characters."
    ),

  amount: amountSchema,

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date must be in YYYY-MM-DD format."
    )
});

export const updateExpenseSchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(
        1,
        "Description cannot be empty."
      )
      .max(
        255,
        "Description must have at most 255 characters."
      )
      .optional(),

    amount: amountSchema.optional(),

    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must be in YYYY-MM-DD format."
      )
      .optional()
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided."
    }
  );
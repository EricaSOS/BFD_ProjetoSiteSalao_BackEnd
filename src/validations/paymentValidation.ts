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

const paymentMethodSchema = z.enum([
  "pix",
  "cash",
  "credit_card",
  "debit_card",
  "other"
]);

export const paymentIdParamsSchema = z.object({
  id: z
    .string()
    .regex(
      /^\d+$/,
      "Payment id must be a number."
    )
    .transform(Number)
    .refine(
      (value) => value > 0,
      {
        message: "Payment id must be positive."
      }
    )
});

export const listPaymentsQuerySchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "cancelled"
    ])
    .optional(),

  professionalId: z
    .string()
    .regex(
      /^\d+$/,
      "Professional id must be a number."
    )
    .transform(Number)
    .refine(
      (value) => value > 0,
      {
        message: "Professional id must be positive."
      }
    )
    .optional(),

  client: z
    .string()
    .trim()
    .min(
      1,
      "Client search must contain at least 1 character."
    )
    .max(
      100,
      "Client search must have at most 100 characters."
    )
    .optional()
});

export const confirmPaymentSchema = z
  .object({
    amount: amountSchema,

    paymentMethod: paymentMethodSchema,

    description: z
      .string()
      .trim()
      .max(
        255,
        "Description must have at most 255 characters."
      )
      .optional()
      .nullable(),

    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must be in YYYY-MM-DD format."
      )
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentMethod === "other" &&
      !data.description?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["description"],
        message:
          "Description is required when payment method is other."
      });
    }
  });

export const updatePaymentSchema = z
  .object({
    amount: amountSchema.optional(),

    paymentMethod: paymentMethodSchema.optional(),

    description: z
      .string()
      .trim()
      .max(
        255,
        "Description must have at most 255 characters."
      )
      .nullable()
      .optional(),

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
      message:
        "At least one field must be provided."
    }
  );
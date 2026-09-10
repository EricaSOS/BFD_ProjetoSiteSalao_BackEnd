import type {
  Request,
  Response
} from "express";

import { getDb } from "../database/db.js";

export async function listPayments(
  req: Request,
  res: Response
) {
  try {
    const {
      status,
      professionalId,
      client
    } = req.query;

    const db = await getDb();

    let query = `
      SELECT
        py.id,
        py.appointment_id,
        py.professional_id,
        py.amount,
        py.payment_method,
        py.description,
        py.date AS payment_date,
        py.status,
        py.created_at,
        py.updated_at,

        a.client_name,
        a.client_phone,
        a.client_email,
        a.service_id,
        a.service_name,
        a.professional_name,
        a.date AS appointment_date,
        a.time AS appointment_time,
        a.price AS appointment_price,
        a.status AS appointment_status,

        p.name AS current_professional_name

      FROM payments py

      INNER JOIN appointments a
        ON a.id = py.appointment_id

      LEFT JOIN professionals p
        ON p.id = py.professional_id

      WHERE 1 = 1
    `;

    const params: unknown[] = [];

    if (status) {
      query += `
        AND py.status = ?
      `;

      params.push(status);
    }

    if (professionalId) {
      query += `
        AND py.professional_id = ?
      `;

      params.push(professionalId);
    }

    if (client) {
      query += `
        AND a.client_name ILIKE ?
      `;

      params.push(`%${client}%`);
    }

    query += `
      ORDER BY
        CASE
          WHEN py.status = 'pending' THEN 1
          WHEN py.status = 'confirmed' THEN 2
          WHEN py.status = 'cancelled' THEN 3
          ELSE 4
        END,
        a.date DESC,
        a.time DESC,
        py.id DESC
    `;

    const payments = await db.all(
      query,
      params
    );

    return res
      .status(200)
      .json(payments);

  } catch (error) {
    console.error(
      "Error listing payments:",
      error
    );

    return res.status(500).json({
      error: "Error listing payments."
    });
  }
}

export async function confirmPayment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      amount,
      paymentMethod,
      description,
      date
    } = req.body;

    const db = await getDb();

    const payment = await db.get(
      `
        SELECT *
        FROM payments
        WHERE id = ?
      `,
      [id]
    );

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found."
      });
    }

    if (payment.status === "confirmed") {
      return res.status(400).json({
        error:
          "Payment is already confirmed."
      });
    }

    if (payment.status === "cancelled") {
      return res.status(400).json({
        error:
          "Cancelled payment cannot be confirmed."
      });
    }

    await db.run(
      `
        UPDATE payments
        SET
          amount = ?,
          payment_method = ?,
          description = ?,
          date = ?,
          status = 'confirmed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        amount,
        paymentMethod,
        description?.trim() || null,
        date,
        id
      ]
    );

    const updatedPayment =
      await getPaymentDetails(db, id);

    return res.status(200).json({
      message:
        "Payment confirmed successfully.",
      payment: updatedPayment
    });

  } catch (error) {
    console.error(
      "Error confirming payment:",
      error
    );

    return res.status(500).json({
      error: "Error confirming payment."
    });
  }
}

export async function updatePayment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      amount,
      paymentMethod,
      description,
      date
    } = req.body;

    const db = await getDb();

    const payment = await db.get(
      `
        SELECT *
        FROM payments
        WHERE id = ?
      `,
      [id]
    );

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found."
      });
    }

    if (payment.status === "cancelled") {
      return res.status(400).json({
        error:
          "Cancelled payment cannot be updated."
      });
    }

    const hasDescription =
      Object.prototype.hasOwnProperty.call(
        req.body,
        "description"
      );

    const finalPaymentMethod =
      paymentMethod ??
      payment.payment_method;

    const finalDescription =
      hasDescription
        ? description
        : payment.description;

    if (
      finalPaymentMethod === "other" &&
      !finalDescription?.trim()
    ) {
      return res.status(400).json({
        error:
          "Description is required when payment method is other."
      });
    }

    const fields: string[] = [];
    const params: unknown[] = [];

    if (amount !== undefined) {
      fields.push("amount = ?");
      params.push(amount);
    }

    if (paymentMethod !== undefined) {
      fields.push(
        "payment_method = ?"
      );

      params.push(paymentMethod);
    }

    if (hasDescription) {
      fields.push(
        "description = ?"
      );

      params.push(
        description?.trim() || null
      );
    }

    if (date !== undefined) {
      fields.push("date = ?");
      params.push(date);
    }

    fields.push(
      "updated_at = CURRENT_TIMESTAMP"
    );

    params.push(id);

    await db.run(
      `
        UPDATE payments
        SET ${fields.join(", ")}
        WHERE id = ?
      `,
      params
    );

    const updatedPayment =
      await getPaymentDetails(db, id);

    return res.status(200).json({
      message:
        "Payment updated successfully.",
      payment: updatedPayment
    });

  } catch (error) {
    console.error(
      "Error updating payment:",
      error
    );

    return res.status(500).json({
      error: "Error updating payment."
    });
  }
}

export async function cancelPayment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const db = await getDb();

    const payment = await db.get(
      `
        SELECT *
        FROM payments
        WHERE id = ?
      `,
      [id]
    );

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found."
      });
    }

    if (payment.status === "cancelled") {
      return res.status(400).json({
        error:
          "Payment is already cancelled."
      });
    }

    await db.run(
      `
        UPDATE payments
        SET
          status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [id]
    );

    const updatedPayment =
      await getPaymentDetails(db, id);

    return res.status(200).json({
      message:
        "Payment cancelled successfully.",
      payment: updatedPayment
    });

  } catch (error) {
    console.error(
      "Error cancelling payment:",
      error
    );

    return res.status(500).json({
      error: "Error cancelling payment."
    });
  }
}

export async function reopenPayment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const db = await getDb();

    const payment = await db.get(
      `
        SELECT *
        FROM payments
        WHERE id = ?
      `,
      [id]
    );

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found."
      });
    }

    if (payment.status !== "cancelled") {
      return res.status(400).json({
        error:
          "Only cancelled payments can be reopened."
      });
    }

    await db.run(
      `
        UPDATE payments
        SET
          status = 'pending',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [id]
    );

    const updatedPayment =
      await getPaymentDetails(db, id);

    return res.status(200).json({
      message:
        "Payment reopened successfully.",
      payment: updatedPayment
    });

  } catch (error) {
    console.error(
      "Error reopening payment:",
      error
    );

    return res.status(500).json({
      error: "Error reopening payment."
    });
  }
}

async function getPaymentDetails(
  db: Awaited<ReturnType<typeof getDb>>,
  id: string | number
) {
  return db.get(
    `
      SELECT
        py.id,
        py.appointment_id,
        py.professional_id,
        py.amount,
        py.payment_method,
        py.description,
        py.date AS payment_date,
        py.status,
        py.created_at,
        py.updated_at,

        a.client_name,
        a.client_phone,
        a.client_email,
        a.service_id,
        a.service_name,
        a.professional_name,
        a.date AS appointment_date,
        a.time AS appointment_time,
        a.price AS appointment_price,
        a.status AS appointment_status,

        p.name AS current_professional_name

      FROM payments py

      INNER JOIN appointments a
        ON a.id = py.appointment_id

      LEFT JOIN professionals p
        ON p.id = py.professional_id

      WHERE py.id = ?
    `,
    [id]
  );
}
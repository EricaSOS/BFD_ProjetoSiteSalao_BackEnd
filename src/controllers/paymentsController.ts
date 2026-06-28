import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listPayments(req: Request, res: Response) {
  try {
    const db = await getDb();

    const payments = await db.all(
      `SELECT
         py.*,
         p.name AS professional_name
       FROM payments py
       LEFT JOIN professionals p
         ON p.id = py.professional_id
       ORDER BY py.date DESC, py.id DESC`
    );

    return res.status(200).json(payments);
  } catch (error) {
    console.error("Error listing payments:", error);
    return res.status(500).json({ error: "Error listing payments." });
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const { professional_id, professionalId, amount, description, date } = req.body;

    const selectedProfessionalId = professional_id ?? professionalId;

    if (!selectedProfessionalId || !amount || !date) {
      return res.status(400).json({
        error: "Professional, amount and date are required."
      });
    }

    const db = await getDb();

    const result = await db.run(
      `INSERT INTO payments (
        professional_id,
        amount,
        description,
        date
      ) VALUES (?, ?, ?, ?)`,
      [
        selectedProfessionalId,
        Number(amount),
        description?.trim() || null,
        date
      ]
    );

    return res.status(201).json({
      message: "Payment created successfully.",
      id: result.lastID
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Error creating payment." });
  }
}

export async function deletePayment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    await db.run("DELETE FROM payments WHERE id = ?", [id]);

    return res.status(200).json({
      message: "Payment deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return res.status(500).json({ error: "Error deleting payment." });
  }
}
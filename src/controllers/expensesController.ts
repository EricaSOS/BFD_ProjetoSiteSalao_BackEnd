import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listExpenses(req: Request, res: Response) {
  try {
    const db = await getDb();

    const expenses = await db.all(
      `SELECT *
       FROM expenses
       ORDER BY date DESC, id DESC`
    );

    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Error listing expenses:", error);
    return res.status(500).json({ error: "Error listing expenses." });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { description, amount, date } = req.body;

    if (!description || !amount || !date) {
      return res.status(400).json({
        error: "Description, amount and date are required."
      });
    }

    const db = await getDb();

    const result = await db.run(
      `INSERT INTO expenses (
        description,
        amount,
        date
      ) VALUES (?, ?, ?)`,
      [description.trim(), Number(amount), date]
    );

    return res.status(201).json({
      message: "Expense created successfully.",
      id: result.lastID
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return res.status(500).json({ error: "Error creating expense." });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    await db.run("DELETE FROM expenses WHERE id = ?", [id]);

    return res.status(200).json({
      message: "Expense deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({ error: "Error deleting expense." });
  }
}
import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listExpenses(req: Request, res: Response) {
  try {
    const db = await getDb();

    const expenses = await db.all(
      `SELECT
        id,
        description,
        amount,
        date,
        created_at
       FROM expenses
       ORDER BY date DESC, id DESC`
    );

    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Error listing expenses:", error);

    return res.status(500).json({
      error: "Error listing expenses."
    });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const {
      description,
      amount,
      date
    } = req.body;

    const db = await getDb();

    const result = await db.run(
      `INSERT INTO expenses (
        description,
        amount,
        date
      ) VALUES (?, ?, ?)`,
      [
        description,
        amount,
        date
      ]
    );

    const expense = await db.get(
      `SELECT
        id,
        description,
        amount,
        date,
        created_at
       FROM expenses
       WHERE id = ?`,
      [result.lastID]
    );

    return res.status(201).json({
      message: "Expense created successfully.",
      expense
    });
  } catch (error) {
    console.error("Error creating expense:", error);

    return res.status(500).json({
      error: "Error creating expense."
    });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      description,
      amount,
      date
    } = req.body;

    const db = await getDb();

    const expense = await db.get(
      `SELECT *
       FROM expenses
       WHERE id = ?`,
      [id]
    );

    if (!expense) {
      return res.status(404).json({
        error: "Expense not found."
      });
    }

    const fields: string[] = [];
    const params: unknown[] = [];

    if (description !== undefined) {
      fields.push("description = ?");
      params.push(description);
    }

    if (amount !== undefined) {
      fields.push("amount = ?");
      params.push(amount);
    }

    if (date !== undefined) {
      fields.push("date = ?");
      params.push(date);
    }

    params.push(id);

    await db.run(
      `UPDATE expenses
       SET ${fields.join(", ")}
       WHERE id = ?`,
      params
    );

    const updatedExpense = await db.get(
      `SELECT
        id,
        description,
        amount,
        date,
        created_at
       FROM expenses
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: "Expense updated successfully.",
      expense: updatedExpense
    });
  } catch (error) {
    console.error("Error updating expense:", error);

    return res.status(500).json({
      error: "Error updating expense."
    });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const db = await getDb();

    const expense = await db.get(
      `SELECT id
       FROM expenses
       WHERE id = ?`,
      [id]
    );

    if (!expense) {
      return res.status(404).json({
        error: "Expense not found."
      });
    }

    await db.run(
      `DELETE FROM expenses
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: "Expense deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting expense:", error);

    return res.status(500).json({
      error: "Error deleting expense."
    });
  }
}
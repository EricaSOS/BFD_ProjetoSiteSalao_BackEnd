import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

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
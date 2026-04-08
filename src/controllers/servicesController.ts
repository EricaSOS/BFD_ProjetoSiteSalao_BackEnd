import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listServices(req: Request, res: Response) {
  try {
    const db = await getDb();

    const services = await db.all(
      "SELECT * FROM servicos WHERE ativo = 1 ORDER BY id"
    );

    res.status(200).json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    res.status(500).json({ erro: "Erro ao buscar serviços." });
  }
}
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
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Error fetching services." });
  }
}

export async function getServiceById(req: Request, res: Response) {
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

    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service by id:", error);
    res.status(500).json({ error: "Error fetching service." });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const { nome, descricao, imagem_url, preco, duracao_minutos } = req.body;

    if (!nome || !preco || !duracao_minutos) {
      return res.status(400).json({
        error: "Fields nome, preco and duracao_minutos are required."
      });
    }

    const db = await getDb();

    const result = await db.run(
      `INSERT INTO servicos (nome, descricao, imagem_url, preco, duracao_minutos, ativo)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [nome, descricao ?? null, imagem_url ?? null, preco, duracao_minutos]
    );

    const newService = await db.get(
      "SELECT * FROM servicos WHERE id = ?",
      [result.lastID]
    );

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Error creating service." });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, descricao, imagem_url, preco, duracao_minutos } = req.body;

    const db = await getDb();

    const existingService = await db.get(
      "SELECT * FROM servicos WHERE id = ? AND ativo = 1",
      [id]
    );

    if (!existingService) {
      return res.status(404).json({ error: "Service not found." });
    }

    await db.run(
      `UPDATE servicos
       SET nome = ?, descricao = ?, imagem_url = ?, preco = ?, duracao_minutos = ?
       WHERE id = ?`,
      [
        nome ?? existingService.nome,
        descricao ?? existingService.descricao,
        imagem_url ?? existingService.imagem_url,
        preco ?? existingService.preco,
        duracao_minutos ?? existingService.duracao_minutos,
        id
      ]
    );

    const updatedService = await db.get(
      "SELECT * FROM servicos WHERE id = ?",
      [id]
    );

    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Error updating service." });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const existingService = await db.get(
      "SELECT * FROM servicos WHERE id = ? AND ativo = 1",
      [id]
    );

    if (!existingService) {
      return res.status(404).json({ error: "Service not found." });
    }

    await db.run(
      "UPDATE servicos SET ativo = 0 WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Error deleting service." });
  }
}
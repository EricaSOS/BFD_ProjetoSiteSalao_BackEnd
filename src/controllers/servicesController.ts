import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listServices(req: Request, res: Response) {
  try {
    const db = await getDb();

    const rows = await db.all(
      "SELECT * FROM services WHERE is_active = 1 ORDER BY id"
    );

    const services = rows.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration_minutes,
      imageUrl: service.image_url
    }));

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Error fetching services." });
  }
}

export async function getServiceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const service = await db.get(
      "SELECT * FROM services WHERE id = ? AND is_active = 1",
      [id]
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    return res.status(200).json({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration_minutes,
      imageUrl: service.image_url
    });
  } catch (error) {
    console.error("Error fetching service by id:", error);
    return res.status(500).json({ error: "Error fetching service." });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const { name, description, imageUrl, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({
        error: "Fields name, price and duration are required."
      });
    }

    const db = await getDb();

    const result = await db.run(
      `INSERT INTO services (name, description, image_url, price, duration_minutes, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [name, description ?? null, imageUrl ?? null, price, duration]
    );

    const newService = await db.get(
      "SELECT * FROM services WHERE id = ?",
      [result.lastID]
    );

    return res.status(201).json({
      id: newService.id,
      name: newService.name,
      description: newService.description,
      price: newService.price,
      duration: newService.duration_minutes,
      imageUrl: newService.image_url
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: "Error creating service." });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, price, duration } = req.body;

    const db = await getDb();

    const existingService = await db.get(
      "SELECT * FROM services WHERE id = ? AND is_active = 1",
      [id]
    );

    if (!existingService) {
      return res.status(404).json({ error: "Service not found." });
    }

    await db.run(
      `UPDATE services
       SET name = ?, description = ?, image_url = ?, price = ?, duration_minutes = ?
       WHERE id = ?`,
      [
        name ?? existingService.name,
        description ?? existingService.description,
        imageUrl ?? existingService.image_url,
        price ?? existingService.price,
        duration ?? existingService.duration_minutes,
        id
      ]
    );

    const updatedService = await db.get(
      "SELECT * FROM services WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      id: updatedService.id,
      name: updatedService.name,
      description: updatedService.description,
      price: updatedService.price,
      duration: updatedService.duration_minutes,
      imageUrl: updatedService.image_url
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ error: "Error updating service." });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const existingService = await db.get(
      "SELECT * FROM services WHERE id = ? AND is_active = 1",
      [id]
    );

    if (!existingService) {
      return res.status(404).json({ error: "Service not found." });
    }

    await db.run(
      "UPDATE services SET is_active = 0 WHERE id = ?",
      [id]
    );

    return res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ error: "Error deleting service." });
  }
}
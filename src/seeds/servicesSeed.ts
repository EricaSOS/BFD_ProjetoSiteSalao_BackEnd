import { getDb } from "../database/db.js";

export async function seedServices() {
  const db = await getDb();

  const count = await db.get("SELECT COUNT(*) as total FROM services");

  if (count.total > 0) {
    console.log("Services already registered. Seed skipped.");
    return;
  }

  await db.run(
    `INSERT INTO services (name, description, image_url, price, duration_minutes, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Corte Feminino",
      "Corte com finalização para valorizar seu estilo.",
      "/images/services/corte-feminino.jpg",
      80.0,
      60,
      1
    ]
  );

  await db.run(
    `INSERT INTO services (name, description, image_url, price, duration_minutes, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Escova",
      "Modelagem e finalização para diferentes ocasiões.",
      "/images/services/escova.jpg",
      50.0,
      40,
      1
    ]
  );

  await db.run(
    `INSERT INTO services (name, description, image_url, price, duration_minutes, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Manicure",
      "Cuidado completo para unhas das mãos.",
      "/images/services/manicure.jpg",
      35.0,
      45,
      1
    ]
  );

  await db.run(
    `INSERT INTO services (name, description, image_url, price, duration_minutes, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Hidratação Capilar",
      "Tratamento para revitalização e brilho dos fios.",
      "/images/services/hidratacao.jpg",
      70.0,
      50,
      1
    ]
  );

  console.log("Services seeded successfully.");
}
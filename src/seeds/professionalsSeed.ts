import { getDb } from "../database/db.js";

export async function seedProfessionals() {
  const db = await getDb();

  const countProfessionals = await db.get(
    "SELECT COUNT(*) as total FROM professionals"
  );

  if (countProfessionals.total > 0) {
    console.log("Professionals already registered. Seed skipped.");
    return;
  }

  await db.run(
    `INSERT INTO professionals (name, photo_url, whatsapp_phone, specialty, rating, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Ricardo Costa",
      "/images/professionals/ricardo.jpg",
      "5591999991111",
      "Cortes e barba",
      4.9,
      true
    ]
  );

  await db.run(
    `INSERT INTO professionals (name, photo_url, whatsapp_phone, specialty, rating, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Ana Beatriz",
      "/images/professionals/ana_manicure.jpg",
      "5591999992222",
      "Coloração e hidratação",
      4.8,
      true
    ]
  );

  await db.run(
    `INSERT INTO professionals (name, photo_url, whatsapp_phone, specialty, rating, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Juliana Souza",
      "/images/professionals/juliana.jpg",
      "5591999993333",
      "Manicure e pedicure",
      4.7,
      true
    ]
  );

  const ricardo = await db.get(
    "SELECT id FROM professionals WHERE name = ?",
    ["Ricardo Costa"]
  );

  const ana = await db.get(
    "SELECT id FROM professionals WHERE name = ?",
    ["Ana Beatriz"]
  );

  const juliana = await db.get(
    "SELECT id FROM professionals WHERE name = ?",
    ["Juliana Souza"]
  );

  const corteFeminino = await db.get(
    "SELECT id FROM services WHERE name = ?",
    ["Corte Feminino"]
  );

  const escova = await db.get(
    "SELECT id FROM services WHERE name = ?",
    ["Escova"]
  );

  const manicure = await db.get(
    "SELECT id FROM services WHERE name = ?",
    ["Manicure"]
  );

  const hidratacao = await db.get(
    "SELECT id FROM services WHERE name = ?",
    ["Hidratação Capilar"]
  );

  if (ricardo && corteFeminino) {
    await db.run(
      `INSERT INTO professional_services (professional_id, service_id)
       VALUES (?, ?)
       ON CONFLICT (professional_id, service_id) DO NOTHING`,
      [ricardo.id, corteFeminino.id]
    );
  }

  if (ricardo && escova) {
    await db.run(
      `INSERT INTO professional_services (professional_id, service_id)
       VALUES (?, ?)
       ON CONFLICT (professional_id, service_id) DO NOTHING`,
      [ricardo.id, escova.id]
    );
  }

  if (ana && escova) {
    await db.run(
      `INSERT INTO professional_services (professional_id, service_id)
       VALUES (?, ?)
       ON CONFLICT (professional_id, service_id) DO NOTHING`,
      [ana.id, escova.id]
    );
  }

  if (ana && hidratacao) {
    await db.run(
      `INSERT INTO professional_services (professional_id, service_id)
       VALUES (?, ?)
       ON CONFLICT (professional_id, service_id) DO NOTHING`,
      [ana.id, hidratacao.id]
    );
  }

  if (juliana && manicure) {
    await db.run(
      `INSERT INTO professional_services (professional_id, service_id)
       VALUES (?, ?)
       ON CONFLICT (professional_id, service_id) DO NOTHING`,
      [juliana.id, manicure.id]
    );
  }

  console.log("Professionals and relationships seeded successfully.");
}
import { getDb } from "../database/db.js";

export async function seedProfessionalUnavailableDates() {
  const db = await getDb();

  const count = await db.get(
    "SELECT COUNT(*) as total FROM professional_unavailable_dates"
  );

  if (count.total > 0) {
    console.log("Professional unavailable dates already registered. Seed skipped.");
    return;
  }

  const ricardo = await db.get(
    "SELECT id FROM professionals WHERE name = ?",
    ["Ricardo Costa"]
  );

  if (ricardo) {
    await db.run(
      `INSERT INTO professional_unavailable_dates
       (professional_id, date, start_time, end_time, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [ricardo.id, "2026-04-22", "08:00", "10:00", "Medical appointment"]
    );
  }

  console.log("Professional unavailable dates seeded successfully.");
}
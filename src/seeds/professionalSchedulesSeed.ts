import { getDb } from "../database/db.js";

export async function seedProfessionalSchedules() {
  const db = await getDb();

  const count = await db.get(
    "SELECT COUNT(*) as total FROM professional_schedules"
  );

  if (count.total > 0) {
    console.log("Professional schedules already registered. Seed skipped.");
    return;
  }

  const ricardo = await db.get(
    "SELECT id FROM profissionais WHERE nome = ?",
    ["Ricardo Costa"]
  );

  const ana = await db.get(
    "SELECT id FROM profissionais WHERE nome = ?",
    ["Ana Beatriz"]
  );

  const juliana = await db.get(
    "SELECT id FROM profissionais WHERE nome = ?",
    ["Juliana Souza"]
  );

  const schedules = [];

  if (ricardo) {
    schedules.push(
      [ricardo.id, 2, "08:00", "12:00", 1], // Monday
      [ricardo.id, 2, "14:00", "18:00", 1],
      [ricardo.id, 3, "08:00", "12:00", 1], // Tuesday
      [ricardo.id, 3, "14:00", "18:00", 1],
      [ricardo.id, 4, "08:00", "12:00", 1], // Wednesday
      [ricardo.id, 4, "14:00", "18:00", 1],
      [ricardo.id, 5, "08:00", "12:00", 1], // Thursday
      [ricardo.id, 5, "14:00", "18:00", 1],
      [ricardo.id, 6, "08:00", "12:00", 1], // Friday
      [ricardo.id, 6, "14:00", "18:00", 1]
    );
  }

  if (ana) {
    schedules.push(
      [ana.id, 3, "09:00", "12:00", 1], // Tuesday
      [ana.id, 3, "13:00", "18:00", 1],
      [ana.id, 4, "09:00", "12:00", 1], // Wednesday
      [ana.id, 4, "13:00", "18:00", 1],
      [ana.id, 5, "09:00", "12:00", 1], // Thursday
      [ana.id, 5, "13:00", "18:00", 1],
      [ana.id, 6, "09:00", "12:00", 1], // Friday
      [ana.id, 6, "13:00", "18:00", 1],
      [ana.id, 7, "09:00", "12:00", 1], // Saturday
      [ana.id, 7, "13:00", "18:00", 1]
    );
  }

  if (juliana) {
    schedules.push(
      [juliana.id, 2, "08:00", "12:00", 1], // Monday
      [juliana.id, 2, "13:00", "16:00", 1],
      [juliana.id, 3, "08:00", "12:00", 1], // Tuesday
      [juliana.id, 3, "13:00", "16:00", 1],
      [juliana.id, 4, "08:00", "12:00", 1], // Wednesday
      [juliana.id, 4, "13:00", "16:00", 1],
      [juliana.id, 5, "08:00", "12:00", 1], // Thursday
      [juliana.id, 5, "13:00", "16:00", 1],
      [juliana.id, 6, "08:00", "12:00", 1], // Friday
      [juliana.id, 6, "13:00", "16:00", 1]
    );
  }

  for (const schedule of schedules) {
    await db.run(
      `INSERT INTO professional_schedules
       (professional_id, day_of_week, start_time, end_time, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      schedule
    );
  }

  console.log("Professional schedules seeded successfully.");
}
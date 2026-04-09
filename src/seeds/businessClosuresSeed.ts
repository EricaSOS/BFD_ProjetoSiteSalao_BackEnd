import { getDb } from "../database/db.js";

export async function seedBusinessClosures() {
  const db = await getDb();

  const count = await db.get(
    "SELECT COUNT(*) as total FROM business_closures"
  );

  if (count.total > 0) {
    console.log("Business closures already registered. Seed skipped.");
    return;
  }

  await db.run(
    `INSERT INTO business_closures
     (date, start_time, end_time, reason)
     VALUES (?, ?, ?, ?)`,
    ["2026-04-21", "08:00", "12:00", "Holiday - morning only"]
  );

  console.log("Business closures seeded successfully.");
}
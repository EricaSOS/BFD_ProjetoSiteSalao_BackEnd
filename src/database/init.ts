import { getDb } from "./db.js";

export async function initDb() {
  const db = await getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      price REAL NOT NULL,
      duration_minutes INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS professionals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo_url TEXT,
      whatsapp_phone TEXT NOT NULL,
      specialty TEXT,
      rating REAL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS professional_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      FOREIGN KEY (professional_id) REFERENCES professionals(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_email TEXT,
      service_id INTEGER NOT NULL,
      professional_id INTEGER NOT NULL,
      service_name TEXT NOT NULL,
      professional_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      whatsapp_message TEXT,
      created_at TEXT NOT NULL,
      cancelled_at TEXT,
      cancellation_reason TEXT,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (professional_id) REFERENCES professionals(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS professional_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (professional_id) REFERENCES professionals(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS professional_unavailable_dates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      professional_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      reason TEXT,
      FOREIGN KEY (professional_id) REFERENCES professionals(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS business_closures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      reason TEXT
    );
  `);

  console.log("Database initialized successfully.");
}
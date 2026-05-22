import { getDb } from "./db.js";

export async function initDb() {
  const db = await getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      price NUMERIC(10,2) NOT NULL,
      duration_minutes INTEGER NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS professionals (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      photo_url TEXT,
      whatsapp_phone TEXT NOT NULL,
      specialty TEXT,
      rating NUMERIC(2,1) DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS professional_services (
      id SERIAL PRIMARY KEY,
      professional_id INTEGER NOT NULL REFERENCES professionals(id),
      service_id INTEGER NOT NULL REFERENCES services(id),
      UNIQUE (professional_id, service_id)
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_email TEXT,
      service_id INTEGER NOT NULL REFERENCES services(id),
      professional_id INTEGER NOT NULL REFERENCES professionals(id),
      service_name TEXT NOT NULL,
      professional_name TEXT NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      whatsapp_message TEXT,
      created_at TIMESTAMP NOT NULL,
      cancelled_at TIMESTAMP,
      cancellation_reason TEXT
    );

    CREATE TABLE IF NOT EXISTS professional_schedules (
      id SERIAL PRIMARY KEY,
      professional_id INTEGER NOT NULL REFERENCES professionals(id),
      day_of_week INTEGER NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS professional_unavailable_dates (
      id SERIAL PRIMARY KEY,
      professional_id INTEGER NOT NULL REFERENCES professionals(id),
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      reason TEXT
    );

    CREATE TABLE IF NOT EXISTS business_closures (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      reason TEXT
    );
  `);

  console.log("Database initialized successfully.");
}
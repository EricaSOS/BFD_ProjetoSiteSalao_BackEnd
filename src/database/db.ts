import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let dbInstance: Database | null = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database
    });

    console.log("Conexão com banco criada.");
  }

  return dbInstance;
}
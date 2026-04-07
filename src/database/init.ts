import { openDb } from "./db.js";

export async function initDb() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      imagem_url TEXT,
      preco REAL NOT NULL,
      duracao_minutos INTEGER NOT NULL,
      ativo INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS profissionais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      foto_url TEXT,
      telefone_whatsapp TEXT NOT NULL,
      especialidade TEXT,
      nota REAL DEFAULT 0,
      ativo INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS profissional_servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profissional_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      FOREIGN KEY (profissional_id) REFERENCES profissionais(id),
      FOREIGN KEY (servico_id) REFERENCES servicos(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS galeria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagem_url TEXT NOT NULL,
      titulo TEXT,
      descricao TEXT,
      ordem INTEGER DEFAULT 0,
      ativo INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_nome TEXT NOT NULL,
      cliente_telefone TEXT NOT NULL,
      cliente_email TEXT,
      servico_id INTEGER NOT NULL,
      profissional_id INTEGER NOT NULL,
      servico_nome TEXT NOT NULL,
      profissional_nome TEXT NOT NULL,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      valor REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendente',
      mensagem_whatsapp TEXT,
      criado_em TEXT NOT NULL,
      FOREIGN KEY (servico_id) REFERENCES servicos(id),
      FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
    );
  `);

  console.log("Banco de dados inicializado com sucesso.");
}
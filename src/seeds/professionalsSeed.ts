import { getDb } from "../database/db.js";

export async function seedProfessionals() {
  const db = await getDb();

  const countProfessionals = await db.get(
    "SELECT COUNT(*) as total FROM profissionais"
  );

  if (countProfessionals.total > 0) {
    console.log("Professionals already registered. Seed skipped.");
    return;
  }

  await db.run(
    `INSERT INTO profissionais (nome, foto_url, telefone_whatsapp, especialidade, nota, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Ricardo Costa",
      "/images/profissionais/ricardo.jpg",
      "5591999991111",
      "Cortes e barba",
      4.9,
      1
    ]
  );

  await db.run(
    `INSERT INTO profissionais (nome, foto_url, telefone_whatsapp, especialidade, nota, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Ana Beatriz",
      "/images/profissionais/ana.jpg",
      "5591999992222",
      "Coloração e hidratação",
      4.8,
      1
    ]
  );

  await db.run(
    `INSERT INTO profissionais (nome, foto_url, telefone_whatsapp, especialidade, nota, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Juliana Souza",
      "/images/profissionais/juliana.jpg",
      "5591999993333",
      "Manicure e pedicure",
      4.7,
      1
    ]
  );

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

  const corteFeminino = await db.get(
    "SELECT id FROM servicos WHERE nome = ?",
    ["Corte Feminino"]
  );

  const escova = await db.get(
    "SELECT id FROM servicos WHERE nome = ?",
    ["Escova"]
  );

  const manicure = await db.get(
    "SELECT id FROM servicos WHERE nome = ?",
    ["Manicure"]
  );

  const hidratacao = await db.get(
    "SELECT id FROM servicos WHERE nome = ?",
    ["Hidratação Capilar"]
  );

  if (ricardo && corteFeminino) {
    await db.run(
      `INSERT INTO profissional_servico (profissional_id, servico_id)
       VALUES (?, ?)`,
      [ricardo.id, corteFeminino.id]
    );
  }

  if (ricardo && escova) {
    await db.run(
      `INSERT INTO profissional_servico (profissional_id, servico_id)
       VALUES (?, ?)`,
      [ricardo.id, escova.id]
    );
  }

  if (ana && escova) {
    await db.run(
      `INSERT INTO profissional_servico (profissional_id, servico_id)
       VALUES (?, ?)`,
      [ana.id, escova.id]
    );
  }

  if (ana && hidratacao) {
    await db.run(
      `INSERT INTO profissional_servico (profissional_id, servico_id)
       VALUES (?, ?)`,
      [ana.id, hidratacao.id]
    );
  }

  if (juliana && manicure) {
    await db.run(
      `INSERT INTO profissional_servico (profissional_id, servico_id)
       VALUES (?, ?)`,
      [juliana.id, manicure.id]
    );
  }

  console.log("Professionals and relationships seeded successfully.");
}
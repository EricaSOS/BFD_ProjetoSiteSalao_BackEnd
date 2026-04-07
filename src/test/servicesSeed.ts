import { openDb } from "../database/db.js";

export async function seedServices() {
  const db = await openDb();

  const quantidade = await db.get("SELECT COUNT(*) as total FROM servicos");

  if (quantidade.total > 0) {
    console.log("Serviços já cadastrados. Seed não executada.");
    return;
  }

  await db.run(
    `INSERT INTO servicos (nome, descricao, imagem_url, preco, duracao_minutos, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Corte Feminino",
      "Corte com finalização para valorizar seu estilo.",
      "/images/servicos/corte-feminino.jpg",
      80.0,
      60,
      1
    ]
  );

  await db.run(
    `INSERT INTO servicos (nome, descricao, imagem_url, preco, duracao_minutos, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Escova",
      "Modelagem e finalização para diferentes ocasiões.",
      "/images/servicos/escova.jpg",
      50.0,
      40,
      1
    ]
  );

  await db.run(
    `INSERT INTO servicos (nome, descricao, imagem_url, preco, duracao_minutos, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Manicure",
      "Cuidado completo para unhas das mãos.",
      "/images/servicos/manicure.jpg",
      35.0,
      45,
      1
    ]
  );

  await db.run(
    `INSERT INTO servicos (nome, descricao, imagem_url, preco, duracao_minutos, ativo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Hidratação Capilar",
      "Tratamento para revitalização e brilho dos fios.",
      "/images/servicos/hidratacao.jpg",
      70.0,
      50,
      1
    ]
  );

  console.log("Serviços de teste inseridos com sucesso.");
}
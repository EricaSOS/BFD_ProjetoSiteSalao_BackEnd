import express from "express";
import cors from "cors";
import { initDb } from "./database/init.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do salão funcionando 🚀");
});

initDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao inicializar banco de dados:", error);
  });
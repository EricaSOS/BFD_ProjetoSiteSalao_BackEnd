import express from "express";
import cors from "cors";
import { initDb } from "./database/init.js";
import { seedServices } from "./seeds/servicesSeed.js";
import servicesRoutes from "./routes/servicesRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// padrão em inglês
app.use("/services", servicesRoutes);

initDb()
  .then(async () => {
    await seedServices();

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database initialization error:", error);
  });
import express from "express";
import cors from "cors";
import { initDb } from "./database/init.js";
import { seedServices } from "./seeds/servicesSeed.js";
import { seedProfessionals } from "./seeds/professionalsSeed.js";
import servicesRoutes from "./routes/servicesRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


app.use("/services", servicesRoutes);


initDb()
  .then(async () => {
    await seedServices();
    await seedProfessionals();

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database initialization error:", error);
  });
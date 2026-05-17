import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { initDb } from "./database/init.js";

import { seedProfessionalSchedules } from "./seeds/professionalSchedulesSeed.js";
import { seedProfessionalUnavailableDates } from "./seeds/professionalUnavailableDatesSeed.js";
import { seedBusinessClosures } from "./seeds/businessClosuresSeed.js";
import { seedServices } from "./seeds/servicesSeed.js";
import { seedProfessionals } from "./seeds/professionalsSeed.js";

import servicesRoutes from "./routes/servicesRoutes.js";
import professionalsRoutes from "./routes/professionalsRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:5173";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later."
  }
});

app.use(helmet());

app.use(
  cors({
    origin: allowedOrigin
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(apiLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


app.use("/services", servicesRoutes);
app.use("/professionals", professionalsRoutes);
app.use(appointmentsRoutes);
app.use(authRoutes);

initDb()
  .then(async () => {
    await seedServices();
    await seedProfessionals();
    await seedProfessionalSchedules();
    await seedProfessionalUnavailableDates();
    await seedBusinessClosures();

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database initialization error:", error);
  });
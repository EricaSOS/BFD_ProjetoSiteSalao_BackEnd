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

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean);

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
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(apiLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/healthz", async (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.use("/services", servicesRoutes);
app.use("/professionals", professionalsRoutes);
app.use(appointmentsRoutes);
app.use(authRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "Origin not allowed."
    });
  }

  return res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : err.message
  });
});

initDb()
  .then(async () => {
    await seedServices();
    await seedProfessionals();
    await seedProfessionalSchedules();
    await seedProfessionalUnavailableDates();
    await seedBusinessClosures();

    const PORT = process.env.PORT ?? 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization error:", error);
  });
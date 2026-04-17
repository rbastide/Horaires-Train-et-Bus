// Import des services et environnement
import express from "express";
import cors from "cors";
import "dotenv/config";

// Import des scripts des routes
import departuresRouter from "./routes/TrainRoutes/departuresFetch.js";
import journeysRouter from "./routes/TrainRoutes/journeysFetch.js";
import boardRouter from "./routes/TrainRoutes/boardFetch.js";

// Création de l'application express
const app = express();
app.use(cors({ origin: true }));

// Création des routes
app.use("/api", departuresRouter);
app.use("/api", journeysRouter);
app.use("/api", boardRouter);

// Port du backend
const PORT = process.env.PORT;

// Lancement du server backend
app.listen(PORT, () => console.log(`✅ Proxy SNCF local: http://localhost:${PORT}`));
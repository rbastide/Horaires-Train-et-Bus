// Import des services et environnement
import express from "express";
import cors from "cors";
import "dotenv/config";

// Import des scripts des routes
import departuresRouter from "./routes/TrainRoutes/departuresFetch.js";
import journeysRouter from "./routes/TrainRoutes/journeysFetch.js";
import boardRouter from "./routes/TrainRoutes/boardFetch.js";

// Port du backend
const PORT = process.env.PORT;

// Création de l'application express
const app = express();
app.use(cors({ origin: true }));

app.get("/config.js", (_req, res) => {
  const apiBase = process.env.API_BASE || `http://localhost:${PORT}/api`;

  res.type("application/javascript").send(
    `window.APP_CONFIG = ${JSON.stringify({ API_BASE: apiBase })};`
  );
});

// Création des routes
app.use("/api", departuresRouter);
app.use("/api", journeysRouter);
app.use("/api", boardRouter);

// Lancement du server backend
app.listen(PORT, () => console.log(`✅ Proxy SNCF local: http://localhost:${PORT}`));

// Import des services et environnement
import express from "express";
import cors from "cors";
import "dotenv/config";
import { testDatabaseConnection } from "./services/databaseConnection.js"

// Import des scripts des routes
import departuresRouter from "./routes/TrainRoutes/departuresFetch.js";
import journeysRouter from "./routes/TrainRoutes/journeysFetch.js";
import boardRouter from "./routes/TrainRoutes/boardFetch.js";
import configRouter from "./services/config.js";
import boardBusRouter from "./routes/BusRoutes/boardBusFetch.js"

// Port du backend
const PORT = process.env.PORT;

// Création de l'application express
const app = express();
app.use(cors({ origin: true }));

// Création des routes
app.use("/api", departuresRouter);
app.use("/api", journeysRouter);
app.use("/api", boardRouter);
app.use("/api", configRouter)
app.use("/api", boardBusRouter)


// Lancement du server backend
testDatabaseConnection()
    .then(() => {
        app.listen(PORT, () => console.log(`✅ Proxy SNCF local: http://localhost:${PORT}`));
    })
    .catch((error) => {
        console.error(" Erreur de connexion mySQL : ", error.message);
    });

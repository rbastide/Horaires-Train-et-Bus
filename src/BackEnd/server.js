import express from "express";
import cors from "cors";
import "dotenv/config";

import departuresRouter from "./routes/TrainRoutes/departuresFetch.js";
import journeysRouter from "./routes/TrainRoutes/journeysFetch.js";
import boardRouter from "./routes/TrainRoutes/boardFetch.js";

const app = express();
app.use(cors({ origin: true }));

app.use("/api", departuresRouter);
app.use("/api", journeysRouter);
app.use("/api", boardRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`✅ Proxy SNCF local: http://localhost:${PORT}`));
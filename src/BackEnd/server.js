import express from "express";
import cors from "cors";
import "dotenv/config";

import departuresRouter from "./routes/departuresFetch.js";
import journeysRouter from "./routes/journeysFetch.js";
import boardRouter from "./routes/boardFetch.js";

const app = express();
app.use(cors({ origin: true }));

app.use("/api", departuresRouter);
app.use("/api", journeysRouter);
app.use("/api", boardRouter);

const PORT = process.env.PORT || 3000;

console.log("Routes attendues :");
console.log("GET  /api/departures");
console.log("GET  /api/journeys");
console.log("GET  /api/board");

app.listen(PORT, () => console.log(`✅ Proxy SNCF local: http://localhost:${PORT}`));
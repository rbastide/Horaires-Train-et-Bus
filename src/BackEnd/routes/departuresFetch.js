import { Router } from "express";
import { getDeparturesJson } from "../services/sncfApi.js";

const router = Router();

router.get("/departures", async (req, res) => {
  try {
    const stop_area = req.query.stop_area;
    const count = req.query.count ?? "10";
    const data_freshness = req.query.data_freshness ?? "realtime";

    if (!stop_area) return res.status(400).json({ error: "Missing stop_area" });

    const { status, body } = await getDeparturesJson({
      token: process.env.SNCF_TOKEN,
      stopArea: stop_area,
      count,
      freshness: data_freshness
    });

    res.status(status).type("application/json").send(body);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
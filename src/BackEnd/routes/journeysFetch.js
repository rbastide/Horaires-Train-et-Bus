import { Router } from "express";
import { getJourneysJson } from "../services/sncfApi.js";
import dotenv from "dotenv";

const router = Router();

router.get("/journeys", async (req, res) => {
  try {
    const { from, to, datetime } = req.query;
    if (!from || !to || !datetime) {
      return res.status(400).json({ error: "Missing from/to/datetime" });
    }

    const { status, body } = await getJourneysJson({
      token: process.env.API_SNCF_KEY,
      from,
      to,
      datetime
    });
    console.log(body)
    res.status(status).type("application/json").send(body);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
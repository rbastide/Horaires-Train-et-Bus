import { Router } from "express";
import { getDeparturesJson, getJourneysJson } from "../services/sncfApi.js";
import { delayMinutes, toHHMM, formatDuration, isTrain, getTerminusId } from "../Utils/helpers.js";

const router = Router();
const MAX_JOURNEYS_ENRICH = 6;

// GET /api/board?stop_area=stop_area:SNCF:87595009&count=10
router.get("/board", async (req, res) => {
  try {
    const token = process.env.API_SNCF_KEY;
    const stop_area = req.query.stop_area;
    const count = Number(req.query.count ?? 10);

    if (!stop_area) return res.status(400).json({ error: "Missing stop_area" });

    const dep = await getDeparturesJson({
      token,
      stopArea: stop_area,
      count,
      freshness: "realtime",
    });

    if (!dep.ok) {
      return res.status(dep.status).json({
        error: "Departures failed",
        status: dep.status,
        url: dep.url,
        body: dep.json ?? dep.text,
      });
    }

    const departures = dep.json?.departures ?? [];
    const trainsOnly = departures.filter(isTrain);

    const rows = [];
    for (let i = 0; i < trainsOnly.length; i++) {
      const d = trainsOnly[i];
      const sdt = d.stop_date_time ?? {};

      const depRT = sdt.departure_date_time;
      const depBase = sdt.base_departure_date_time ?? depRT;
      const delay = delayMinutes(depRT, depBase);

      const platform = sdt.platform ?? "--";

      const lineCode =
        d.route?.line?.code ||
        d.display_informations?.code ||
        d.display_informations?.label ||
        "--";

      const terminusId = getTerminusId(d);
      const destination =
        d.route?.direction?.stop_area?.name ||
        (d.display_informations?.direction?.split(" (")[0]) ||
        "--";

      let duration = "--";
      let arrival = "--:--";

      if (i < MAX_JOURNEYS_ENRICH && terminusId && depRT) {
        const j = await getJourneysJson({
          token,
          from: stop_area,
          to: terminusId,
          datetime: depRT,
        });

        if (j.ok) {
          const j0 = (j.json?.journeys ?? [])[0];
          if (j0) {
            duration = formatDuration(j0.duration);
            if (j0.arrival_date_time) arrival = toHHMM(j0.arrival_date_time);
          }
        }
      }

      rows.push({
        line: lineCode,
        platform,
        duration,
        departure: toHHMM(depRT),
        departure_base: toHHMM(depBase),
        arrival,
        origin: "Périgueux",
        destination,
        delay_minutes: delay,
        status: delay > 0 ? `Retard ${delay} min` : "À l'heure",
      });
    }

    return res.json({ stop_area, total: rows.length, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

export default router;
import { Router } from "express";
import { getDeparturesJson, getJourneysJson } from "../services/sncfApi.js";
import { delayMinutes, toHHMM, formatDuration, isTrain, getTerminusId, buildDisruptionMap, buildTerminusMap } from "../utils/helpers.js";

const router = Router();
const MAX_JOURNEYS_ENRICH = 6;



// GET /api/board?stop_area=stop_area:SNCF:87595009&count=10
router.get("/board", async (req, res) => {
  try {
    const token = process.env.API_SNCF_KEY;
    const stop_area = req.query.stop_area;
    const count = Number(req.query.count ?? 10);

    if (!stop_area) {
      return res.status(400).json({ error: "Missing stop_area" });
    }

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

    const apiJson = dep.json ?? {};
    const departures = apiJson.departures ?? [];
    const terminusMap = buildTerminusMap(apiJson);
    const disruptionMap = buildDisruptionMap(apiJson);

    const trainsOnly = departures.filter((d) => {
      const isTrainDeparture = isTrain(d);
      const isPerigueux =
        d?.stop_point?.stop_area?.id === stop_area ||
        d?.stop_point?.stop_area?.name === "Périgueux";
      return isTrainDeparture && isPerigueux;
    });

    const rows = [];

    for (let i = 0; i < trainsOnly.length; i++) {
      const d = trainsOnly[i];
      const sdt = d.stop_date_time ?? {};

      const depRT = sdt.departure_date_time;
      const depBase = sdt.base_departure_date_time ?? depRT;
      const delay = delayMinutes(depRT, depBase);
      const platform = sdt.platform ?? "Aucune Information";

      const lineCode =
        d.route?.line?.code ||
        d.display_informations?.code ||
        d.display_informations?.label ||
        "--";

      const tripShortName = d.display_informations?.trip_short_name;
      const terminusId = getTerminusId(d);

      let destination =
        terminusMap.get(terminusId) ||
        disruptionMap.get(tripShortName)?.terminusName ||
        d.display_informations?.direction?.split(" (")[0] ||
        d.route?.direction?.stop_area?.name ||
        "--";

      let duration = "--";
      let arrival = disruptionMap.get(tripShortName)?.arrivalTime ?? "--:--";

      if (arrival === "--:--" && i < MAX_JOURNEYS_ENRICH && terminusId && depRT) {
        const j = await getJourneysJson({
          token,
          from: stop_area,
          to: terminusId,
          datetime: depRT,
        });

        if (j.ok) {
          const journeys = j.json?.journeys ?? [];

          const matchedJourney =
            journeys.find((x) => x?.departure_date_time === depRT) ||
            journeys[0];

          if (matchedJourney) {
            duration = formatDuration(matchedJourney.duration);
            if (matchedJourney.arrival_date_time) {
              arrival = toHHMM(matchedJourney.arrival_date_time);
            }
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

    return res.json({
      stop_area,
      total: rows.length,
      rows,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

export default router;
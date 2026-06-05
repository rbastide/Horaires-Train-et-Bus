import { Router } from "express";
import { getDeparturesJson, getJourneysJson } from "../../services/sncfApi.js";
import {
  delayMinutes, toHHMM, formatDuration, isTrain, getTerminusId, buildDisruptionMap,
  calculOfArrivalTimeAndDelayTime
} from "../../utils/helpers.js";

// Variable Globales
const router = Router();
const MAX_JOURNEYS_ENRICH = 6;


// Création de la route pour récupérer les informations demandé pour la section train
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
    const disruptionMap = buildDisruptionMap(apiJson);

    const trainsOnly = departures.filter((d) => {
      return isTrain(d)
    });

    const rows = [];

    for (let i = 0; i < trainsOnly.length; i++) {
      if (rows.length < 3) {
        const d = trainsOnly[i];
        const stopDateTime = d.stop_date_time ?? {};

        const departureRealTime = stopDateTime.departure_date_time; // Heure départ de la gare en temps réel
        const departureTimeFromBase = stopDateTime.base_departure_date_time ?? departureRealTime; // Heure départ du quai de la gare | Si il existe on le prend sinon c departureRealTime

        const delay = delayMinutes(departureRealTime, departureTimeFromBase);

        const lineCode = d.display_informations?.code || "--";

        const tripShortName = d.display_informations?.trip_short_name;

        const terminusId = getTerminusId(d);

        let destination = d.route?.direction?.stop_area?.name || "--";

        let durationJourney = "--";

        let arrival = disruptionMap.get(tripShortName)?.arrivalTime ?? "--:--";

        if (arrival === "--:--" && i < MAX_JOURNEYS_ENRICH && terminusId && departureRealTime) {
          const j = await getJourneysJson({
            token,
            from: stop_area,
            to: terminusId,
            datetime: departureRealTime,
          });

          if (j.ok) {
            const journeys = j.json?.journeys ?? [];

            const matchedJourney =
                journeys.find((x) => x?.departure_date_time === departureRealTime) ||
                journeys[0];

            if (matchedJourney) {
              durationJourney = formatDuration(matchedJourney.duration);
              if (matchedJourney.arrival_date_time) {
                arrival = toHHMM(matchedJourney.arrival_date_time);
              }
            }
          }
        }


        if (destination !== "Périgueux") {
          rows.push({
            line: lineCode,
            duration: durationJourney,
            departure_time: toHHMM(departureRealTime),
            departure_time_base: toHHMM(departureTimeFromBase),
            arrival_time: calculOfArrivalTimeAndDelayTime(arrival, delay),
            arrival_time_base: arrival,
            origin: "Périgueux",
            destination,
            delay_minutes: delay,
            status: delay > 0 ? `Retard ${delay} min` : "À l'heure",
          });
        }
      }
    }

    console.log(rows);


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
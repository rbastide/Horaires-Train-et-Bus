import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

const SNCF_BASE = "https://api.sncf.com/v1";
const COVERAGE = "sncf";

const TOKEN = process.env.API_SNCF_KEY;
if (!TOKEN) {
  console.error("❌ API_SNCF_KEY manquante dans .env");
  process.exit(1);
}

// --- CORS: autorise ton front local
app.use(cors({ origin: true }));

// --- Helpers
function basicAuthHeader(token) {
  // Basic auth: username=token, password vide
  const b64 = Buffer.from(`${token}:`).toString("base64");
  return `Basic ${b64}`;
}

function toHHMM(dt) {
  if (!dt) return "--:--";
  return dt.slice(9, 11) + ":" + dt.slice(11, 13);
}

function parseNavitiaDate(dt) {
  const y = +dt.slice(0, 4);
  const mo = +dt.slice(4, 6) - 1;
  const d = +dt.slice(6, 8);
  const hh = +dt.slice(9, 11);
  const mm = +dt.slice(11, 13);
  const ss = +dt.slice(13, 15);
  return new Date(Date.UTC(y, mo, d, hh, mm, ss));
}

function delayMinutes(realtimeDT, baseDT) {
  if (!realtimeDT || !baseDT) return 0;
  const diff = (parseNavitiaDate(realtimeDT) - parseNavitiaDate(baseDT)) / 60000;
  return Math.max(0, Math.round(diff));
}

function formatDuration(seconds) {
  if (typeof seconds !== "number") return "--";
  const min = Math.round(seconds / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

// Cache simple en mémoire pour éviter de spammer journeys (TTL 60s)
const cache = new Map();
function cacheGet(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.exp) {
    cache.delete(key);
    return null;
  }
  return item.value;
}
function cacheSet(key, value, ttlMs = 60000) {
  cache.set(key, { value, exp: Date.now() + ttlMs });
}

// --- 1) Proxy Departures
// GET /api/departures?stop_area=stop_area:SNCF:87595009&count=10
app.get("/api/departures", async (req, res) => {
  try {
    const stopArea = req.query.stop_area;
    const count = req.query.count ?? "10";
    const freshness = req.query.data_freshness ?? "realtime";

    if (!stopArea) {
      return res.status(400).json({ error: "Missing stop_area" });
    }

    // Endpoint departures + data_freshness=realtime
    const sncfUrl =
      `${SNCF_BASE}/coverage/${COVERAGE}/stop_areas/${encodeURIComponent(stopArea)}` +
      `/departures?data_freshness=${encodeURIComponent(freshness)}&count=${encodeURIComponent(count)}`;

    const r = await fetch(sncfUrl, {
      headers: { Authorization: basicAuthHeader(TOKEN) },
    });

    const text = await r.text();
    res.status(r.status).type("application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- 2) Proxy Journeys
// GET /api/journeys?from=stop_area:SNCF:...&to=stop_area:SNCF:...&datetime=YYYYMMDDTHHMMSS
app.get("/api/journeys", async (req, res) => {
  try {
    const { from, to, datetime } = req.query;
    if (!from || !to || !datetime) {
      return res.status(400).json({ error: "Missing from/to/datetime" });
    }

    // Endpoint journeys [4](https://ressources.data.sncf.com/api/explore/v2.1/console)[5](https://blog.csdn.net/2401_87595699/article/details/159929782)
    const sncfUrl =
      `${SNCF_BASE}/coverage/${COVERAGE}/journeys` +
      `?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&datetime=${encodeURIComponent(datetime)}`;

    const r = await fetch(sncfUrl, {
      headers: { Authorization: basicAuthHeader(TOKEN) },
    });

    const text = await r.text();
    res.status(r.status).type("application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- 3) BONUS: /api/board
// Renvoie DIRECTEMENT: ligne, quai, durée, départ, arrivée, retard.
// GET /api/board?stop_area=stop_area:SNCF:87595009&count=10
app.get("/api/board", async (req, res) => {
  try {
    const stopArea = req.query.stop_area;
    const count = Number(req.query.count ?? 10);

    if (!stopArea) {
      return res.status(400).json({ error: "Missing stop_area" });
    }

    // 1) departures
    const depUrl =
      `${SNCF_BASE}/coverage/${COVERAGE}/stop_areas/${encodeURIComponent(stopArea)}` +
      `/departures?data_freshness=realtime&count=${encodeURIComponent(count)}`; // [3](https://www.jura-modelisme.fr/shop/category/maquette-422)[2](https://help.figma.com/hc/en-us/categories/360002042553-Figma-design)

    const depResp = await fetch(depUrl, {
      headers: { Authorization: basicAuthHeader(TOKEN) },
    });
    if (!depResp.ok) {
      return res.status(depResp.status).json({ error: "Departures failed" });
    }
    const depJson = await depResp.json();

    const deps = depJson.departures ?? [];

    // Filtrer uniquement les trains (ton JSON mélange Train/Coach)
    const trainsOnly = deps.filter(d => (d.stop_point?.id || "").endsWith(":Train"));

    // 2) enrichir durée + heure d'arrivée via journeys (limite à 6 pour rester “safe”)
    const MAX_ENRICH = 6;

    const rows = await Promise.all(
      trainsOnly.map(async (d, idx) => {
        const lineCode =
          d.route?.line?.code ||
          d.display_informations?.code ||
          d.display_informations?.label ||
          "--";

        const sdt = d.stop_date_time ?? {};
        const depRT = sdt.departure_date_time;
        const depBase = sdt.base_departure_date_time ?? depRT;

        const delay = delayMinutes(depRT, depBase);

        // Quai: parfois présent en sdt.platform, sinon fallback
        const platform = sdt.platform ?? "--";

        // Terminus id: dans stop_date_time.links (category terminus)
        const termLink = (sdt.links ?? []).find(l => l.category === "terminus" && l.id);
        const terminusId = termLink?.id || null;

        const destination =
          d.route?.direction?.stop_area?.name ||
          (d.display_informations?.direction?.split(" (")[0]) ||
          "--";

        let duration = "--";
        let arrHHMM = "--:--";

        if (idx < MAX_ENRICH && terminusId && depRT) {
          const cacheKey = `j:${stopArea}:${terminusId}:${depRT}`;
          const cached = cacheGet(cacheKey);
          let j0 = cached;

          if (!j0) {
            const jUrl =
              `${SNCF_BASE}/coverage/${COVERAGE}/journeys` +
              `?from=${encodeURIComponent(stopArea)}` +
              `&to=${encodeURIComponent(terminusId)}` +
              `&datetime=${encodeURIComponent(depRT)}`; // [4](https://ressources.data.sncf.com/api/explore/v2.1/console)[5](https://blog.csdn.net/2401_87595699/article/details/159929782)

            const jResp = await fetch(jUrl, {
              headers: { Authorization: basicAuthHeader(TOKEN) },
            });
            const jJson = await jResp.json();
            j0 = (jJson.journeys ?? [])[0] || null;
            cacheSet(cacheKey, j0);
          }

          if (j0) {
            duration = formatDuration(j0.duration);
            if (j0.arrival_date_time) arrHHMM = toHHMM(j0.arrival_date_time);
          }
        }

        return {
          line: lineCode,
          platform,
          duration,
          departure: toHHMM(depRT),
          departure_base: toHHMM(depBase),
          arrival: arrHHMM,
          origin: "Périgueux",
          destination,
          delay_minutes: delay,
          status: delay > 0 ? `Retard ${delay} min` : "À l'heure",
        };
      })
    );

    res.json({ stop_area: stopArea, count: rows.length, rows });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ SNCF proxy local: http://localhost:${PORT}`);
});
``
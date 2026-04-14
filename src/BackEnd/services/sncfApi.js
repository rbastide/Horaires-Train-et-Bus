import { basicAuthHeader } from "../utils/helpers.js";

const SNCF_BASE = "https://api.sncf.com/v1";
const COVERAGE = "sncf";

export async function sncfFetchJson({ token, path, query = {}, timeoutMs = 8000 }) {
  const url = new URL(`${SNCF_BASE}${path}`);

  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const r = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: basicAuthHeader(token), Accept: "application/json" },
      signal: controller.signal,
    });

    const text = await r.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch {}

    return { ok: r.ok, status: r.status, url: url.toString(), text, json };
  } finally {
    clearTimeout(timer);
  }
}

export function getDeparturesJson({ token, stopArea, count = 10, freshness = "realtime" }) {
  return sncfFetchJson({
    token,
    path: `/coverage/${COVERAGE}/stop_areas/${encodeURIComponent(stopArea)}/departures`,
    query: { data_freshness: freshness, count },
  });
}

export function getJourneysJson({ token, from, to, datetime }) {
  return sncfFetchJson({
    token,
    path: `/coverage/${COVERAGE}/journeys`,
    query: { from, to, datetime },
  });
}
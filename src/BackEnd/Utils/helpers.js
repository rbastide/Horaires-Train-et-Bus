export function basicAuthHeader(token) {
  const b64 = Buffer.from(`${token}:`).toString("base64");
  return `Basic ${b64}`;
}

export function toHHMM(dt) {
  if (!dt) return "--:--";
  return dt.slice(9, 11) + ":" + dt.slice(11, 13);
}

export function parseNavitiaDate(dt) {
  const y = +dt.slice(0, 4);
  const mo = +dt.slice(4, 6) - 1;
  const d = +dt.slice(6, 8);
  const hh = +dt.slice(9, 11);
  const mm = +dt.slice(11, 13);
  const ss = +dt.slice(13, 15);
  return new Date(Date.UTC(y, mo, d, hh, mm, ss));
}

export function delayMinutes(realtimeDT, baseDT) {
  if (!realtimeDT || !baseDT) return 0;
  const diff = (parseNavitiaDate(realtimeDT) - parseNavitiaDate(baseDT)) / 60000;
  return Math.max(0, Math.round(diff));
}

export function formatDuration(seconds) {
  if (typeof seconds !== "number") return "--";
  const min = Math.round(seconds / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

export function isTrain(dep) {
  return (dep.stop_point?.id || "").endsWith(":Train");
}

export function getTerminusId(dep) {
  const links = dep.stop_date_time?.links ?? [];
  const term = links.find(l => l.category === "terminus" && l.id);
  return term?.id || null;
}
// Fonction de connexion a l'api
export function basicAuthHeader(token) {
  return `Basic ${btoa(`${token}:`)}`;
}

// Fonction de conversion des heures en format HHMM
export function toHHMM(dt) {
  if (!dt) return "--:--";
  return dt.slice(9, 11) + ":" + dt.slice(11, 13);
}
// Format italien
export function toHHMMit(dt) {
  if (!dt) return "--:--";
  return dt.slice(0,5);
}

// Fonction de conversion des heures en format MMSS
export function toMMSS(dt) {
  if (!dt) return "--:--";
  return dt.slice(2,8);
}

// Fonction de conversion de la date donnée par Navitia en format YYYY MM DD HH mm SS
export function parseNavitiaDate(dt) {
  const y = +dt.slice(0, 4);
  const mo = +dt.slice(4, 6) - 1;
  const d = +dt.slice(6, 8);
  const hh = +dt.slice(9, 11);
  const mm = +dt.slice(11, 13);
  const ss = +dt.slice(13, 15);
  return new Date(Date.UTC(y, mo, d, hh, mm, ss));
}


// Fonction de calcul des minutes de retard
export function delayMinutes(realtimeDT, baseDT) {
  if (!realtimeDT || !baseDT) return 0;
  const diff = (parseNavitiaDate(realtimeDT) - parseNavitiaDate(baseDT)) / 60000;
  return Math.max(0, Math.round(diff));
}


// Fonction qui transforme les secondes en format : hh min
export function formatDuration(seconds) {
  if (typeof seconds !== "number") return "--";
  const min = Math.round(seconds / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

// Test si le mode de transport est bien un train
export function isTrain(dep) {
  return (dep.stop_point?.id || "").endsWith(":Train");
}

// Fonction récupérant l'id du terminus
export function getTerminusId(dep) {
  const links = dep.stop_date_time?.links ?? [];
  const term = links.find(l => l.category === "terminus" && l.id);
  return term?.id || null;
}

// Fonction de conversion des heures compactées en format hhmm
function hhmmFromCompact(time) {
  if (!time || typeof time !== "string" || time.length < 4) return "--:--";
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

// Conversion du temps en format hh:mm:ss en secondes
export function timeToSeconds(timeStr) {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

// Fonction récupérant le temps d'attente entre 2 temps 
export function getWaitingTime(startTime, endTime) {
  let startSeconds, finishSeconds;
  startSeconds = startTime;
  finishSeconds = endTime;

  let diff = finishSeconds - startSeconds;

  // si on passe au jour suivant
  if (diff < 0) {
    diff += 24 * 3600;
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return `${hours}:${minutes}:${seconds}`;
}


// Création d'une liste d'arrêts pour les requêtes SQL
export function getListStops(stops){
    let listStops = "";
    stops.forEach(element => {
        listStops += `'${element}',`;
    });
    listStops = listStops.slice(0, -1);
    return listStops;
}


// Calcul de l'heure d'arrivée si le train est en retard
export function arrivalTimeDelayed(arrival_time, delay) {
  if (!arrival_time || typeof arrival_time !== "string" || !arrival_time.includes(":")) {
    return "--:--";
  }
  
  const [hoursStr, minutesStr] = arrival_time.split(":");
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes) || isNaN(delay)) {
    return "--:--";
  }
  minutes += delay;
  
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  
  return `${paddedHours}:${paddedMinutes}`;
}

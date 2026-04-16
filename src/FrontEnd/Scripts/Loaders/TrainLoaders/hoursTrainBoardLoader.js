/* =========================
   CONFIG
   ========================= */

const API_BASE = "http://localhost:3000/api";

const STOP_AREA_PERIGUEUX = "stop_area:SNCF:87595009";

/* =========================
   FETCH DATA
   ========================= */

async function fetchTrainBoardData(count = 10) {
  const url =
    `${API_BASE}/board` +
    `?stop_area=${encodeURIComponent(STOP_AREA_PERIGUEUX)}` +
    `&count=${count}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

/* =========================
   BUILD ONE ROW
   ========================= */

function buildTrainRow(row) {
  const tr = document.createElement("tr");

  const isDelayed = Number(row.delay_minutes || 0) > 0;

  tr.innerHTML = `
    <td colspan="4">
      <div class="row-wrapper">
        <div class="row-grid-train">

          <!-- Colonne 1 -->
          <div class="cell">
            <div class="line-cell line-cell--train">
              <span class="line-badge ${row.line}">${row.line}</span>
              <img src="Logo/Train.png" alt="Train" class="line-icon">
            </div>
          </div>

          <!-- Colonne 2 -->
          <div class="Time">
            <img src="Logo/Horloge.png" alt="Logo - Horloge" class="Horloge">
              ${row.duration}
          </div>

          
          <!-- Colonne 3 -->
          ${
            isDelayed
            ? `
            <div class="DepartDelayed">
             <p>${row.departure_base} ${row.origin}</p>

            <p class="delayedTime"><strong>${row.departure}</strong> ${row.origin}</p>

              <p>${row.arrival} ${row.destination}</p>

              <p class="delayedTime"><strong>${row.arrival}</strong> ${row.destination} </p>
            </div>
            `
            : `
            <!-- Colonne 3 -->
            <div class="Depart">
              <p><strong>${row.departure}</strong> ${row.origin}</p>
              <p><strong>${row.arrival}</strong> ${row.destination}</p>
            </div>
            `
          }

         <!-- Colonne 4 -->
          <div class="Status">
            <span class="status ${isDelayed ? "delayed" : "ontime"}">${row.status ?? (isDelayed ? "Retardé" : "À l'heure")}</span>
          </div>
        </div>
      </div>
    </td>
                       
  `;

  return tr;
};

/* =========================
   RENDER TABLE
   ========================= */

function renderTrainBoard(rows) {
  const tbody = document.getElementById("train-departures-body");

  if (!tbody) {
    console.warn("train-departures-body introuvable → tableau non injecté ou mauvais timing");
    return;
  }

  tbody.innerHTML = "";

  rows.forEach((row) => {
    tbody.appendChild(buildTrainRow(row));
  });
}

/* =========================
   API PUBLIQUE
   ========================= */

window.loadHoursTrainBoard = async function () {
  try {
    const data = await fetchTrainBoardData(10);

    const rows = Array.isArray(data) ? data : (data.rows || []);

    if (!Array.isArray(rows)) {
      throw new Error("Format de données inattendu : rows absent ou non tableau");
    }

    renderTrainBoard(rows);
  } catch (error) {
    console.error("Erreur chargement horaires train :", error);
  }
};
const API_BASE = "http://localhost:3000/api";
const STOP_AREA_PERIGUEUX = "stop_area:SNCF:87595009";

/* =========================
   FETCH JSON
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
}

/* =========================
   BUILD ROW
========================= */
function buildTrainRow(row) {
  const tr = document.createElement("tr");
  const isDelayed = row.delay_minutes > 0;

  tr.innerHTML = `
    <td colspan="5">
      <div class="row-wrapper">
        <div class="row-grid">

          <!-- Colonne 1 : Ligne -->
          <div class="cell">
            <div class="line-cell line-cell--train">
              <span class="line-badge ${row.line}">${row.line}</span>
              <img src="Logo/Train.png" alt="Train" class="line-icon">
            </div>
          </div>

          <!-- Colonne 2 : Quai -->
          <div class="Quais">
            ${row.platform}
          </div>

          <!-- Colonne 3 : Durée -->
          <div class="Time">
            <img src="Logo/Horloge.png" alt="Horloge" class="Horloge">
            ${row.duration}
          </div>

          <!-- Colonne 4 : Départ / Arrivée -->
          <div class="Depart">
            ${
              isDelayed
                ? `
                  <div class="DepartDelayed">
                    <p><s><strong>${row.departure_base}</strong></s> ${row.origin}</p>
                    <p class="delayedTime"><strong>${row.departure}</strong> ${row.origin}</p>
                    <p><strong>${row.arrival}</strong> ${row.destination}</p>
                  </div>
                `
                : `
                  <p><strong>${row.departure}</strong> ${row.origin}</p>
                  <p><strong>${row.arrival}</strong> ${row.destination}</p>
                `
            }
          </div>

          <!-- Colonne 5 : Statut -->
          <div>
            <span class="status ${isDelayed ? "delayed" : "ontime"}">
              ${row.status}
            </span>
          </div>

        </div>
      </div>
    </td>
  `;

  return tr;
}
``

/* =========================
   RENDER
========================= */
function renderTrainBoard(rows) {
  const tbody = document.getElementById("train-board-body");

  if (!tbody) {
    console.warn("train-board-body introuvable (HTML pas encore chargé)");
    return;
  }

  tbody.innerHTML = "";
  rows.forEach(row => tbody.appendChild(buildTrainRow(row)));
}

/* =========================
   API PUBLIQUE
========================= */
window.loadHoursTrainBoard = async function () {
  try {
    const data = await fetchTrainBoardData(10);
    renderTrainBoard(data.rows);
  } catch (e) {
    console.error("Erreur chargement train", e);
  }
};
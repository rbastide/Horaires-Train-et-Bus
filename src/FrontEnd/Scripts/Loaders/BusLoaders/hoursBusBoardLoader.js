/* =========================
   Variables globales
   ========================= */

/* Point d'entrée de l'API backend exposée via la configuration frontend */
const API_BASE = window.APP_CONFIG?.API_BASE;

/* =========================
   Récupération des données importantes du train
   ========================= */

/*
 * Récupère les prochains départs/arrivées pour la gare configurée.
 * Le paramètre count permet de limiter le nombre de lignes retournées.
 */
async function fetchBusBoardData() {
  const url = `${API_BASE}/busBoard`;

  const response = await fetch(url);

  /* Remonte explicitement une erreur HTTP pour être gérée par l'appelant */
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

/* =========================
   Construction des lignes du tableau dans la section train
   ========================= */

/*
 * Construit une ligne HTML du tableau train à partir d'un objet métier.
 * Le rendu diffère légèrement si le train est en retard.
 */
function buildBusRow(row) {
  const tr = document.createElement("tr");

  /* Un retard existe dès que delay_minutes est supérieur à 0 */
  const isDelayed = Number(row.delay_minutes || 0) > 0;

  tr.innerHTML = `
    <td colspan="5">
                    <div class="row-wrapper">
                      <div class="row-grid-bus">

                       <!-- Colonne 1 -->
                      <div class="cell">
                        <div class="line-cell line-cell--bus">
                          <img src="Logo/Bus.png" alt="Bus" class="line-icon">
                          <img src="Logo/HandicapeSigne.png" alt="Accessibilité" class="line-icon">

                          <span class="line-badge ${row.line}">${row.line}</span>
                        </div>
                      </div>

                      <!-- Colonne 2 -->
                      <div class ="Arrets">
                        ${row.stops}
                      </div>

                      <!-- Colonne 3 -->
                      <div class="Destinations">
                        ${row.destinations}
                      </div>

                      <!-- Colonne 4 -->
                      <div class="DepartTime">
                        Prévu . ${row.time}
                      </div>

                      <!-- Colonne 5 -->
                      <div class="Attente">
                            ${row.timeToWait}
                            <img src="Logo/T.png" alt="Logo - Heure Théorique" class="TableauLignesBus">
                      </div>

                      </div>
                    </div>
                  </td>             
  `;
  return tr;
};

/* =========================
   Affichage de la partie train
   ========================= */

/*
 * Injecte toutes les lignes du tableau dans le tbody cible.
 * Si le composant HTML n'est pas encore chargé, on sort proprement.
 */
function renderBusBoard(rows) {
  const tbody = document.getElementById("bus-departures-body");

  if (!tbody) {
    console.warn("bus-departures-body introuvable → tableau non injecté ou mauvais timing");
    return;
  }

  /* Réinitialise le tableau avant de réinjecter les nouvelles données */
  tbody.innerHTML = "";

  rows.forEach((row) => {
    tbody.appendChild(buildTrainRow(row));
  });
}

/* =========================
   API Publique
   ========================= */

/*
 * Fonction publique appelée depuis le chargement de la vue train.
 * Elle récupère les données, normalise le format, puis déclenche le rendu.
 */
window.loadHoursBusBoard = async function () {
  try {
    const data = await fetchBusBoardData;

    /* Accepte soit un tableau direct, soit un objet contenant une propriété rows */
    const rows = Array.isArray(data) ? data : (data.rows || []);

    if (!Array.isArray(rows)) {
      throw new Error("Format de données inattendu : rows absent ou non tableau");
    }

    renderBusBoard(rows);
  } catch (error) {
    console.error("Erreur chargement horaires train :", error);
  }
};

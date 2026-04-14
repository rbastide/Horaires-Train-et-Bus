
async function loadTrainSection() {
    try {
    const res = await fetch("FrontEnd/Components/TrainComponents/FirstSectionTrain.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("train-section-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement FirstSectionTrain.html :", err);
  }
    
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const container = document.getElementById("train-board-body");

    if (!container) {
      console.error("Le conteneur #train-board-body est introuvable.");
      return;
    }

    const response = await fetch("./FrontEnd/Components/TrainComponents/HoursTrainBoard.html");

    if (!response.ok) {
      throw new Error(`Erreur chargement HoursTrainBoard.html : HTTP ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    console.log("HoursTrainBoard.html injecté avec succès");

    if (typeof window.loadHoursTrainBoard === "function") {
      await window.loadHoursTrainBoard();
      console.log("Horaires train chargés");
    } else {
      console.warn("window.loadHoursTrainBoard n'est pas défini");
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la section train :", error);
  }
});
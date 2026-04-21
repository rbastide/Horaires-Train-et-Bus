// Chargement du tableau des trains
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const container = document.getElementById("bus-board-body");

    if (!container) {
      console.error("Le conteneur #bus-board-body est introuvable.");
      return;
    }

    const response = await fetch("./FrontEnd/Components/TrainComponents/HoursBusBoard.html");

    if (!response.ok) {
      throw new Error(`Erreur chargement HoursBusBoard.html : HTTP ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    console.log("HoursBusBoard.html injecté avec succès");

    if (typeof window.loadHoursBusBoard === "function") {
      await window.loadHoursBusBoard();
      console.log("Horaires train chargés");
    } else {
      console.warn("window.loadHoursBusBoard n'est pas défini");
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la section train :", error);
  }
});
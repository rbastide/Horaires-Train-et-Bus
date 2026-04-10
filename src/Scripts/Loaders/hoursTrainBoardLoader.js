async function loadHoursTrainBoard() {
    try {
    const res = await fetch("Components/HoursTrainBoard.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("hours-train-board-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement HoursTrainBoard.html :", err);
  }
    
}
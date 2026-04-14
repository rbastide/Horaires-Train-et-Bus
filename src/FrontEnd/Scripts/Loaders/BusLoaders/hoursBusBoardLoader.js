async function loadHoursBusBoard() {
    try {
    const res = await fetch("FrontEnd/Components/BusComponents/HoursBusBoard.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("hours-bus-board-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement HoursBusBoard.html :", err);
  }
    
}
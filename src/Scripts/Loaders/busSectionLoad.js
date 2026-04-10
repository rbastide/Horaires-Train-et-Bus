async function loadBusSection() {
    try {
    const res = await fetch("Components/FirstSectionBus.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("bus-section-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement FirstSectionBus.html :", err);
  }
    
}
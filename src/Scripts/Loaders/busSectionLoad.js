async function loadBusSection() {
    try {
    const res = await fetch("Components/SectionBus.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("bus-section-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement SectionBus.html :", err);
  }
    
}
async function loadBusFooter() {
    try {
    const res = await fetch("Frontend/Components/BusComponents/FooterBus.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("footer-bus-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement FooterBus.html :", err);
  }
    
}
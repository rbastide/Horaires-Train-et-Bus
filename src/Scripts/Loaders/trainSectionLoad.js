async function loadTrainSection() {
    try {
    const res = await fetch("Components/SectionTrain.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("train-section-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement SectionTrain.html :", err);
  }
    
}
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
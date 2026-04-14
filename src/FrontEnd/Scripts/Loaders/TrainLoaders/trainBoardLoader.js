document.addEventListener("DOMContentLoaded", () => {
  fetch("FrontEnd/Components/TrainComponents/HoursTrainBoard.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("train-board-body").innerHTML = html;
    })
    .catch(err => console.error("Erreur chargement tableau train", err));
});
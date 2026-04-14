let currentSection = 'train';

function rotateSection() {
  const trainSection = document.getElementById('train-section-placeholder');
  const trainBoard = document.getElementById('train-board-table-body');
  const busSection = document.getElementById('bus-section-placeholder');
  const busBoard = document.getElementById('hours-bus-board-placeholder');

  if (currentSection === 'train') {
    // Passer à Bus
    trainSection.style.display = 'none';
    trainBoard.style.display = 'none';
    busSection.style.display = 'block';
    busBoard.style.display = 'block';
    currentSection = 'bus';
    console.log('Affichage: Section Bus');
  } else {
    // Passer à Train
    trainSection.style.display = 'block';
    trainBoard.style.display = 'block';
    busSection.style.display = 'none';
    busBoard.style.display = 'none';
    currentSection = 'train';
    console.log('Affichage: Section Train');
    
    loadHoursTrainBoard();
  }
}

// Initialiser les sections
async function initSections() {
  try {
    // Charger train d'abord
    await loadTrainSection();
    await new Promise(requestAnimationFrame);
    await loadHoursTrainBoard();
    // Charger bus mais le cacher
    await loadBusSection();
    await loadHoursBusBoard();
    document.getElementById('bus-section-placeholder').style.display = 'none';
    document.getElementById('hours-bus-board-placeholder').style.display = 'none';

    console.log('Sections chargées - Rotation chaque 30 secondes');
    // Alterner toutes les 30 secondes
    setInterval(rotateSection, 30000);
  } catch (err) {
    console.error("Erreur initialisation sections :", err);
  }
}

// Appeler au chargement du DOM
document.addEventListener('DOMContentLoaded', initSections);

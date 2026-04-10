let currentSection = 'train';

function rotateSection() {
  const trainPlaceholder = document.getElementById('train-section-placeholder');
  const busPlaceholder = document.getElementById('bus-section-placeholder');

  if (currentSection === 'train') {
    // Passer à Bus
    trainPlaceholder.style.display = 'none';
    busPlaceholder.style.display = 'block';
    currentSection = 'bus';
    console.log('Affichage: Section Bus');
  } else {
    // Passer à Train
    trainPlaceholder.style.display = 'block';
    busPlaceholder.style.display = 'none';
    currentSection = 'train';
    console.log('Affichage: Section Train');
  }
}

// Initialiser les sections
async function initSections() {
  try {
    // Charger train d'abord
    await loadTrainSection();
    // Charger bus mais le cacher
    await loadBusSection();
    document.getElementById('bus-section-placeholder').style.display = 'none';

    console.log('Sections chargées - Rotation chaque 30 secondes');
    // Alterner toutes les 30 secondes
    setInterval(rotateSection, 30000);
  } catch (err) {
    console.error("Erreur initialisation sections :", err);
  }
}

// Appeler au chargement du DOM
document.addEventListener('DOMContentLoaded', initSections);

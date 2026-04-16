let currentSection = 'train';
let rotationInterval = null;

function getEl(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[sectionRotate] Élément introuvable : #${id}`);
  }
  return el;
}

function setDisplay(el, value) {
  if (el) {
    el.style.display = value;
  }
}

function rotateSection() {
  const trainSection = getEl('train-section-placeholder');
  const trainBoard = getEl('train-board-body');
  const busSection = getEl('bus-section-placeholder');
  const busBoard = getEl('hours-bus-board-placeholder');
  const busFooter = getEl('footer-bus-placeholder');

  if (!trainSection || !trainBoard || !busSection || !busBoard || !busFooter) {
    console.warn('[sectionRotate] Rotation annulée : un ou plusieurs éléments sont absents du DOM.');
    return;
  }

  if (currentSection === 'train') {
    // Passer à Bus
    setDisplay(trainSection, 'none');
    setDisplay(trainBoard, 'none');
    setDisplay(busSection, 'block');
    setDisplay(busBoard, 'block');
    setDisplay(busFooter, 'block');

    currentSection = 'bus';
    console.log('Affichage: Section Bus');
  } else {
    // Passer à Train
    setDisplay(trainSection, 'block');
    setDisplay(trainBoard, 'block');
    setDisplay(busSection, 'none');
    setDisplay(busBoard, 'none');
    setDisplay(busFooter, 'none');

    currentSection = 'train';
    console.log('Affichage: Section Train');

    // Recharge si la fonction existe
    if (typeof loadHoursTrainBoard === 'function') {
      loadHoursTrainBoard();
    }
  }
}

// Initialiser les sections
async function initSections() {
  try {
    // Charger train d'abord
    await loadTrainSection();
    await new Promise(requestAnimationFrame);
    await loadHoursTrainBoard();

    // Charger bus ensuite
    await loadBusSection();
    await loadHoursBusBoard();
    await loadBusFooter();

    const busSection = getEl('bus-section-placeholder');
    const busBoard = getEl('hours-bus-board-placeholder');
    const busFooter = getEl('footer-bus-placeholder');

    setDisplay(busSection, 'none');
    setDisplay(busBoard, 'none');
    setDisplay(busFooter,'none');

    console.log('Sections chargées - Rotation chaque 30 secondes');

    if (rotationInterval) {
      clearInterval(rotationInterval);
    }

    rotationInterval = setInterval(rotateSection, 30000);
  } catch (err) {
    console.error('Erreur initialisation sections :', err);
  }
}

// Appeler au chargement du DOM
document.addEventListener('DOMContentLoaded', initSections);

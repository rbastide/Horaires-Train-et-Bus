// Variable Globales
let currentSection = 'train';
let rotationInterval = null;


// Fonction récupérant un élément par id
function getEl(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[sectionRotate] Élément introuvable : #${id}`);
  }
  return el;
}

// Fonction affichant le style
// Si value = none -> Pas d'affichage
// Si value = block -> Affichage
function setDisplay(el, value) {
  if (el) {
    el.style.display = value;
  }
}


// Fonction permettant la rotation des sections
function rotateSection() {

  // Placeholders
  const trainSection = getEl('train-section-placeholder');
  const trainBoard = getEl('train-board-body');
  const busSection = getEl('bus-section-placeholder');
  const busBoard = getEl('bus-board-body');

  // Test si il existe les éléments suivant : trainSection, trainBoard, busSection, busBoard, busFooter
  if (!trainSection || !trainBoard || !busSection || !busBoard) {
    console.warn('[sectionRotate] Rotation annulée : un ou plusieurs éléments sont absents du DOM.');
    return;
  }

  // Partie Bus
  if (currentSection === 'train') {
    // Passer à Bus
    setDisplay(trainSection, 'none');
    setDisplay(trainBoard, 'none');
    setDisplay(busSection, 'block');
    setDisplay(busBoard, 'block');

    currentSection = 'bus';
    console.log('Affichage: Section Bus');

    // Recharge si la fonction existe
    if (typeof loadHoursBusBoard === 'function') {
      loadHoursBusBoard();
    }
  } 
  //Partie Train
  else {
    // Passer à Train
    setDisplay(trainSection, 'block');
    setDisplay(trainBoard, 'block');
    setDisplay(busSection, 'none');
    setDisplay(busBoard, 'none');

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
    await new Promise(requestAnimationFrame);
    await loadHoursBusBoard();

    // Placeholders des bus
    const busSection = getEl('bus-section-placeholder');
    const busBoard = getEl('bus-board-body');

    // Désactiver l'affichage de la section bus
    setDisplay(busSection, 'none');
    setDisplay(busBoard, 'none');

    // Afficher en console que les sections sont chargés
    console.log('Sections chargées - Rotation chaque 30 secondes');

    // Test si la rotation existe
    // Si oui -> on la vide
    // Sinon -> on fait rien
    if (rotationInterval) {
      clearInterval(rotationInterval);
    }

    //Interval de rotation 
    rotationInterval = setInterval(rotateSection, 30000);
  } catch (err) {
    console.error('Erreur initialisation sections :', err);
  }
}

// Appeler au chargement du DOM
document.addEventListener('DOMContentLoaded', initSections);

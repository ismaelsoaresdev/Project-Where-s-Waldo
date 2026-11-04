const API_URL = 'http://localhost:3000/api';

const gameImage = document.getElementById('game-image');
const gameContainer = document.getElementById('game-container') || gameImage.parentElement;
const targetMenu = document.getElementById('target-menu');
const targetList = document.getElementById('target-list');
const timerDisplay = document.getElementById('timer');
const scoreVal = document.getElementById('score-val');

let currentClickCoords = { x: 0, y: 0 };
let targets = [];
let foundCount = 0;
let startTime = Date.now();
let timerInterval = null;

// Start the game timer
function startTimer() {
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    if (timerDisplay) {
      timerDisplay.textContent = `Time: ${elapsedSeconds}s`;
    }
  }, 1000);
}

// Fetch targets from backend on startup
async function fetchTargets() {
  try {
    const response = await fetch(`${API_URL}/targets`);
    targets = await response.json();
    populateTargetMenu();
    startTimer();
  } catch (error) {
    console.error('Error fetching targets:', error);
  }
}

// Populate dropdown menu items
function populateTargetMenu() {
  targetList.innerHTML = '';
  targets.forEach((target) => {
    const li = document.createElement('li');
    li.textContent = target.name;
    li.addEventListener('click', () => handleTargetSelection(target.id, li));
    targetList.appendChild(li);
  });
}

// Handle image click event (normalizing X, Y to 0.0 - 1.0)
gameImage.addEventListener('click', (event) => {
  const rect = gameImage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  currentClickCoords = { x, y };

  console.log(`X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);

  // Position target menu near the click location relative to container
  const containerRect = gameContainer.getBoundingClientRect();
  targetMenu.style.left = `${event.clientX - containerRect.left}px`;
  targetMenu.style.top = `${event.clientY - containerRect.top}px`;
  targetMenu.classList.remove('hidden');
});

// Hide menu if user clicks elsewhere
document.addEventListener('click', (event) => {
  if (!gameImage.contains(event.target) && !targetMenu.contains(event.target)) {
    targetMenu.classList.add('hidden');
  }
});

// Validate user selection with backend API
async function handleTargetSelection(targetId, listItem) {
  targetMenu.classList.add('hidden');

  try {
    const response = await fetch(`${API_URL}/targets/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetId,
        x: currentClickCoords.x,
        y: currentClickCoords.y,
      }),
    });

    const result = await response.json();

    if (result.found) {
      // Incrementa apenas uma vez
      foundCount++;
      if (scoreVal) { 
        scoreVal.textContent = `${foundCount}/${targets.length}`; 
      }

      // Prevent selecting the same target twice
      listItem.style.pointerEvents = 'none';
      listItem.style.opacity = '0.5';

      // Create visual marker on successful find
      const marker = document.createElement('div');
      marker.classList.add('marker');
      marker.style.position = 'absolute';
      marker.style.width = '30px';
      marker.style.height = '30px';
      marker.style.border = '3px solid #2ecc71';
      marker.style.borderRadius = '50%';
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.pointerEvents = 'none';

      // Position marker based on image dimensions
      marker.style.left = `${currentClickCoords.x * gameImage.clientWidth}px`;
      marker.style.top = `${currentClickCoords.y * gameImage.clientHeight}px`;

      gameContainer.appendChild(marker);
      
      // Check if all targets have been found
      if (foundCount === targets.length) {
        clearInterval(timerInterval);
        const finalTime = Math.floor((Date.now() - startTime) / 1000);
        
        setTimeout(() => {
          const playerName = prompt(`Congratulations! You found all characters in ${finalTime} seconds. Enter your name for the high score:`);
          if (playerName) {
            submitScore(playerName, finalTime);
          }
        }, 200);
      } else {
        alert('You found a character!');
      }
    } else {
      alert('Keep trying!');
    }
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Submit score to backend
async function submitScore(playerName, timeInSeconds) {
  try {
    await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, timeInSeconds }),
    });
    alert('Score saved successfully!');
    fetchHighScores(); // Atualiza a tabela de high scores automaticamente após submeter
  } catch (error) {
    console.error('Error submitting score:', error);
  }
}

// Fetch and display high scores
async function fetchHighScores() {
  try {
    const response = await fetch(`${API_URL}/scores`);
    const scores = await response.json();
    
    const scoresList = document.getElementById('high-scores-list');
    if (!scoresList) return;
    
    scoresList.innerHTML = '';
    
    scores.forEach((score, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<span><strong>#${index + 1}</strong> ${score.playerName}</span> <span>${score.timeInSeconds}s</span>`;
      scoresList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching high scores:', error);
  }
}

// Initialize the game
fetchTargets();
fetchHighScores();
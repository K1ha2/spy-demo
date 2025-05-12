let players = [];
let spyIndex = -1;
let secretWord = "";
let currentRound = 1;
let totalRounds = 3;
let scores = {};
let locations = ["Beach", "Hospital", "School", "Airport", "Bank", "Theater"];
let gameLang = "en";

// Utility functions
const $ = (id) => document.getElementById(id);

// Initialize game
window.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  showSetupScreen();
});

// Load settings (language & rounds)
function loadSettings() {
  gameLang = localStorage.getItem("lang") || "en";
  totalRounds = parseInt(localStorage.getItem("rounds")) || 3;
}

// Screen: Player Setup
function showSetupScreen() {
  $("game-container").innerHTML = `
    <h2>Enter player names</h2>
    <div id="player-inputs">
      <input type="text" placeholder="Player 1" />
      <input type="text" placeholder="Player 2" />
      <input type="text" placeholder="Player 3" />
    </div>
    <button onclick="addPlayerInput()">+ Add Player</button>
    <button onclick="startGame()">Start Game</button>
  `;
  $("round-info").textContent = `Round ${currentRound} of ${totalRounds}`;
}

// Add input field
function addPlayerInput() {
  const div = document.createElement("input");
  div.type = "text";
  div.placeholder = `Player ${document.querySelectorAll("#player-inputs input").length + 1}`;
  $("player-inputs").appendChild(div);
}

// Start game logic
function startGame() {
  players = [...document.querySelectorAll("#player-inputs input")]
    .map((input) => input.value.trim())
    .filter((name) => name);
  if (players.length < 3) {
    alert("At least 3 players required.");
    return;
  }

  // Initialize scores
  players.forEach((p) => {
    if (!scores[p]) scores[p] = 0;
  });

  setupRound();
}

// Setup round
function setupRound() {
  spyIndex = Math.floor(Math.random() * players.length);
  secretWord = locations[Math.floor(Math.random() * locations.length)];

  let html = "<h2>Secret Role Distribution</h2><ul>";
  players.forEach((player, index) => {
    html += `<li><strong>${player}:</strong> <span>${
      index === spyIndex ? "Spy (guess the word)" : secretWord
    }</span></li>`;
  });
  html += `</ul><button onclick="startVoting()">Next: Voting</button>`;

  $("game-container").innerHTML = html;
}

// Voting phase
function startVoting() {
  let html = "<h2>Vote who is the Spy</h2><form id='vote-form'>";
  players.forEach((player) => {
    html += `
      <label><input type="radio" name="vote" value="${player}" /> ${player}</label><br/>
    `;
  });
  html += `</form><button onclick="submitVote()">Submit Vote</button>`;
  $("game-container").innerHTML = html;
}

// Vote result
function submitVote() {
  const selected = document.querySelector('input[name="vote"]:checked');
  if (!selected) return alert("Please select someone.");
  const voted = selected.value;
  const spy = players[spyIndex];

  let message;
  if (voted === spy) {
    scores[voted] += 0;
    message = `Correct! ${spy} was the Spy.`;
    players.forEach((p, i) => {
      if (p !== spy) scores[p] += 1;
    });
  } else {
    message = `Wrong! ${spy} was the Spy.`;
    scores[spy] += 2;
  }

  $("game-container").innerHTML = `
    <h2>Round Result</h2>
    <p>${message}</p>
    <p>The secret word was: <strong>${secretWord}</strong></p>
    <button onclick="nextRound()">Continue</button>
  `;
}

// Move to next round
function nextRound() {
  if (currentRound < totalRounds) {
    currentRound++;
    $("round-info").textContent = `Round ${currentRound} of ${totalRounds}`;
    setupRound();
  } else {
    showFinalScore();
  }
}

// Final scoreboard
function showFinalScore() {
  let html = "<h2>Final Scores</h2><ul>";
  const maxScore = Math.max(...Object.values(scores));
  for (const player in scores) {
    const isWinner = scores[player] === maxScore;
    html += `<li>${player}: ${scores[player]} ${isWinner ? "(Winner)" : ""}</li>`;
  }
  html += "</ul><button onclick='restartGame()'>Play Again</button>";
  $("game-container").innerHTML = html;
  $("round-info").textContent = "Game Over";
}

// Reset everything
function restartGame() {
  currentRound = 1;
  scores = {};
  showSetupScreen();
}


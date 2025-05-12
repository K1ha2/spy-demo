// Help button opens instructions modal
document.getElementById("help-btn").addEventListener("click", () => {
  const lang = localStorage.getItem("lang") || "en";
  const trans = langData[lang];

  const helpText = `
    <h2>${trans.title} - Help</h2>
    <p><strong>Goal:</strong> Identify the spy among the players. The spy tries to guess the secret word without being caught.</p>
    <p><strong>Setup:</strong> Each player taps their name to privately see their role. Non-spies see a location (e.g. "Beach"), the spy sees only “You are the spy.”</p>
    <p><strong>Gameplay:</strong> Players take turns describing the location without naming it. The spy listens and tries to blend in.</p>
    <p><strong>Vote:</strong> After discussion, all players vote on who they think the spy is.</p>
    <p><strong>Rounds:</strong> Play continues for the selected number of rounds. Scores are updated after each round.</p>
  `;
  openModal(helpText);
});

// Role reveal logic for offline mode
let currentPlayerIndex = 0;
let rolesAssigned = [];

function setupRoleReveal(players, secretWord, spyIndex) {
  rolesAssigned = players.map((p, i) => ({
    name: p,
    role: i === spyIndex ? "spy" : "citizen"
  }));
  currentPlayerIndex = 0;
  showPlayerPrompt();
}

function showPlayerPrompt() {
  const player = rolesAssigned[currentPlayerIndex];
  const prompt = `
    <h3>Pass the device to: <strong>${player.name}</strong></h3>
    <p>Tap below when ready</p>
    <button onclick="revealRole()">Show Role</button>
  `;
  openModal(prompt);
}

function revealRole() {
  const player = rolesAssigned[currentPlayerIndex];
  const lang = localStorage.getItem("lang") || "en";
  const trans = langData[lang];

  const roleText = player.role === "spy"
    ? `<h2>You are the <span style="color:red;">Spy</span>!</h2><p>Try to guess the secret word.</p>`
    : `<h2>You are a <span style="color:green;">Citizen</span>.</h2><p>The secret word is: <strong>${window.secretWord}</strong></p>`;

  const nextBtnText = currentPlayerIndex < rolesAssigned.length - 1
    ? "Next Player"
    : "Start Game";

  const nextAction = currentPlayerIndex < rolesAssigned.length - 1
    ? "nextPlayer()"
    : "beginGame()";

  const content = `
    ${roleText}
    <button onclick="${nextAction}">${nextBtnText}</button>
  `;
  openModal(content);
}

function nextPlayer() {
  currentPlayerIndex++;
  showPlayerPrompt();
}

function beginGame() {
  closeModal();
  // Start the main game phase here (discussion, then vote)
}

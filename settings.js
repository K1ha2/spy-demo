let langData = {};
let deferredPrompt = null;

// Load language JSON
fetch("lang.json")
  .then(res => res.json())
  .then(data => {
    langData = data;
    applyLanguage(localStorage.getItem("lang") || "en");
  });

// Open settings modal
document.getElementById("settings-btn").addEventListener("click", () => {
  const currentLang = localStorage.getItem("lang") || "en";
  const currentRounds = localStorage.getItem("rounds") || 3;

  const content = `
    <h2>Settings</h2>
    <label>Language:</label>
    <select id="language-select">
      ${Object.keys(langData).map(
        lang =>
          `<option value="${lang}" ${
            lang === currentLang ? "selected" : ""
          }>${langData[lang].language}</option>`
      ).join("")}
    </select>

    <label>Rounds:</label>
    <select id="rounds-select">
      <option value="3" ${currentRounds == 3 ? "selected" : ""}>3</option>
      <option value="5" ${currentRounds == 5 ? "selected" : ""}>5</option>
      <option value="10" ${currentRounds == 10 ? "selected" : ""}>10</option>
    </select>

    <button onclick="saveSettings()">Save</button>
    <button onclick="resetGameData()">Reset Game Data</button>
    <button id="install-btn" style="display:none;">Download App</button>
  `;

  openModal(content);

  if (deferredPrompt) {
    document.getElementById("install-btn").style.display = "inline-block";
    document.getElementById("install-btn").addEventListener("click", () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    });
  }
});

// Save settings
function saveSettings() {
  const lang = document.getElementById("language-select").value;
  const rounds = document.getElementById("rounds-select").value;
  localStorage.setItem("lang", lang);
  localStorage.setItem("rounds", rounds);
  alert("Settings saved.");
  location.reload();
}

// Reset game data
function resetGameData() {
  if (confirm("Reset all player data and scores?")) {
    localStorage.clear();
    location.reload();
  }
}

// Install PWA
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Apply translations
function applyLanguage(lang) {
  const trans = langData[lang] || langData["en"];
  document.title = trans.title;
  document.getElementById("game-title").textContent = trans.title;
}

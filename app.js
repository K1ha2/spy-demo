let currentLang = 'de';
let scores = {};
let currentRound = 1;
let totalRounds = 5;
let spy = '';
let word = '';
let words = ['Strand', 'Krankenhaus', 'U-Bahn', 'Restaurant', 'Flughafen', 'Schule', 'Theater', 'Zoo'];
let installPromptEvent = null;

// Sprachdatei laden
fetch('lang.json')
  .then(res => res.json())
  .then(data => {
    window.translations = data;
    applyLanguage(currentLang);
  });

function applyLanguage(lang) {
  currentLang = lang;
  const t = window.translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.title = t.title;
  document.getElementById('title').textContent = t.title;
  updateScoreDisplay();
}

document.getElementById('languageSelect').addEventListener('change', (e) => {
  applyLanguage(e.target.value);
});

document.getElementById('settingsToggle').addEventListener('click', () => {
  document.getElementById('settings').classList.toggle('hidden');
});

// Spiel starten
function startGame() {
  const count = parseInt(document.getElementById('playerCount').value);
  const playerNamesDiv = document.getElementById('playerNames');
  playerNamesDiv.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Spieler ${i}`;
    playerNamesDiv.appendChild(input);
  }
  const btn = document.createElement('button');
  btn.textContent = window.translations[currentLang].start_game;
  btn.onclick = assignRoles;
  playerNamesDiv.appendChild(btn);
}

// Rollen verteilen
function assignRoles() {
  const inputs = Array.from(document.querySelectorAll('#playerNames input'));
  const names = inputs.map(input => input.value || `Spieler${Math.random().toString(36).substr(2, 3)}`);
  spy = names[Math.floor(Math.random() * names.length)];
  word = words[Math.floor(Math.random() * words.length)];
  showRoles(names);
}

// Rollen anzeigen
function showRoles(names) {
  const container = document.getElementById('roles');
  container.innerHTML = '';
  names.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => {
      alert(name === spy
        ? `${window.translations[currentLang].you_are_spy}`
        : `${window.translations[currentLang].your_word_is}: ${word}`);
      btn.disabled = true;
    };
    container.appendChild(btn);
  });
  document.getElementById('setup').classList.add('hidden');
  container.classList.remove('hidden');
  document.getElementById('discussion').classList.remove('hidden');
}

// Abstimmung anzeigen
function showVoting() {
  const voting = document.getElementById('voting');
  voting.innerHTML = '';
  const buttons = document.querySelectorAll('#roles button');
  buttons.forEach(btn => {
    const voteBtn = document.createElement('button');
    voteBtn.textContent = btn.textContent;
    voteBtn.onclick = () => endRound(voteBtn.textContent);
    voting.appendChild(voteBtn);
  });
  voting.classList.remove('hidden');
}

// Runde beenden
function endRound(voted) {
  let result = `${window.translations[currentLang].spy_is}: ${spy}\n${window.translations[currentLang].word_was}: ${word}`;
  if (voted === spy) {
    scores[voted] = (scores[voted] || 0) + 1;
    result += `\n${voted} hat verloren!`;
  } else {
    scores[spy] = (scores[spy] || 0) + 1;
    result += `\n${spy} hat gewonnen!`;
  }

  document.getElementById('result').textContent = result;
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('voting').classList.add('hidden');
  document.getElementById('discussion').classList.add('hidden');
  document.getElementById('roles').classList.add('hidden');
  updateScoreDisplay();

  currentRound++;
  if (currentRound <= totalRounds) {
    const btn = document.createElement('button');
    btn.textContent = window.translations[currentLang].new_round;
    btn.onclick = () => location.reload();
    document.getElementById('result').appendChild(btn);
  } else {
    const end = document.createElement('p');
    end.textContent = 'Spiel beendet!';
    document.getElementById('result').appendChild(end);
  }
}

// Scoreboard anzeigen
function updateScoreDisplay() {
  const label = window.translations?.[currentLang]?.score || 'Score';
  let html = `${label}: `;
  for (let [name, score] of Object.entries(scores)) {
    html += `${name}: ${score} | `;
  }
  document.getElementById('scoreDisplay').textContent = html.slice(0, -3);
}

// Zurücksetzen
function resetScore() {
  scores = {};
  currentRound = 1;
  updateScoreDisplay();
}

// Runden aus Settings
document.getElementById('rounds').addEventListener('input', (e) => {
  totalRounds = parseInt(e.target.value);
});

// PWA install button
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPromptEvent = e;
});

function installPWA() {
  if (installPromptEvent) {
    installPromptEvent.prompt();
  }
}

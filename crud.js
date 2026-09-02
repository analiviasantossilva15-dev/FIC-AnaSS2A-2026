const STORAGE_KEY = 'veridia_players_db';

let players = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: '1', name: 'Kaelen', classType: 'Guardião da Aurora', level: 12 }
];

const playerForm = document.getElementById('playerForm');
const playerIdInput = document.getElementById('playerId');
const nameInput = document.getElementById('playerName');
const classInput = document.getElementById('playerClass');
const levelInput = document.getElementById('playerLevel');
const tableBody = document.getElementById('playerTableBody');

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function renderTable() {
  tableBody.innerHTML = '';
  
  if (players.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum guardião registrado em Veridia.</td></tr>';
    return;
  }

  players.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td>${p.classType}</td>
      <td>Lvl ${p.level}</td>
      <td>
        <button class="btn-action edit" onclick="editPlayer('${p.id}')">Editar</button>
        <button class="btn-action delete" onclick="deletePlayer('${p.id}')">Banir</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

playerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = playerIdInput.value;
  const name = nameInput.value;
  const classType = classInput.value;
  const level = levelInput.value;

  if (id) {
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
      players[index] = { id, name, classType, level };
    }
  } else {
    players.push({ id: Date.now().toString(), name, classType, level });
  }

  saveToStorage();
  renderTable();
  playerForm.reset();
  playerIdInput.value = '';
});

window.editPlayer = function(id) {
  const player = players.find(p => p.id === id);
  if (player) {
    playerIdInput.value = player.id;
    nameInput.value = player.name;
    classInput.value = player.classType;
    levelInput.value = player.level;
  }
};

window.deletePlayer = function(id) {
  players = players.filter(p => p.id !== id);
  saveToStorage();
  renderTable();
};

renderTable();

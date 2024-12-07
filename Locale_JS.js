const board = document.getElementById('board'); // Griglia di gioco
const message = document.getElementById('message'); // Messaggio di stato del gioco
const resetButton = document.getElementById('reset'); // Bottone per resettare il gioco
const toggleSizeButton = document.getElementById('toggle-size'); // Bottone per cambiare dimensione della griglia

let player1Symbol, player2Symbol; // Simboli dei giocatori
let currentPlayer; // Giocatore attuale ('Player 1' o 'Player 2')
let numPiazzamenti = 3; // Dimensione della griglia (3x3 o 4x4)
let gameState = Array(numPiazzamenti * numPiazzamenti).fill(null); // Stato della griglia
let gameActive = true; // Flag che indica se il gioco è attivo
let redCellSelected = false; // Tracks whether a random cell has already been blocked

// Funzione per far scegliere a Player 1 il proprio simbolo
function chooseSymbol() {
    const choice = prompt("Player 1, scegli X o O").toUpperCase();
    if (choice !== 'X' && choice !== 'O') {
        alert("Scelta non valida");
        chooseSymbol();
    } else {
        player1Symbol = choice;
        player2Symbol = player1Symbol === 'X' ? 'O' : 'X';
        currentPlayer = 'Player 1'; // Player 1 inizia
    }
}

// Crea le condizioni di vittoria dinamiche
function condizioniVittoria(numPiazzamenti) {
    const winningConditions = [];

    // Orizzontali
    for (let row = 0; row < numPiazzamenti; row++) {
        const start = row * numPiazzamenti;
        const condition = [];
        for (let col = 0; col < numPiazzamenti; col++) {
            condition.push(start + col);
        }
        winningConditions.push(condition);
    }

    // Verticali
    for (let col = 0; col < numPiazzamenti; col++) {
        const condition = [];
        for (let row = 0; row < numPiazzamenti; row++) {
            condition.push(row * numPiazzamenti + col);
        }
        winningConditions.push(condition);
    }

    // Diagonali
    const diagonal1 = [];
    for (let i = 0; i < numPiazzamenti; i++) {
        diagonal1.push(i * numPiazzamenti + i);
    }
    winningConditions.push(diagonal1);
    const diagonal2 = [];
    for (let i = 0; i < numPiazzamenti; i++) {
        diagonal2.push((i + 1) * numPiazzamenti - (i + 1));
    }
    winningConditions.push(diagonal2);

    return winningConditions;
}

// Controlla se c'è un vincitore o pareggio
function checkWinner() {
    const winningConditions = condizioniVittoria(numPiazzamenti);
    for (let condition of winningConditions) {
        const allEqual = condition.every(
            (index) => gameState[index] && gameState[index] === gameState[condition[0]]
        );
        if (allEqual) {
            return gameState[condition[0]] === player1Symbol ? 'Player 1' : 'Player 2';
        }
    }
    return gameState.includes(null) ? null : 'Draw'; // nessun vincitore
}

// Aggiorna il messaggio di stato
function updateMessage(winner) {
    if (winner === 'Draw') {
        message.textContent = "Pareggio!";
    } else if (winner) {
        message.textContent = `${winner} ha vinto!`;
    } else {
        message.textContent = `Turno di ${currentPlayer}`;
    }
}

// Gestisce il click su una cella
function handleCellClick(e) {
    const cellIndex = e.target.dataset.index;

    if (!gameActive || gameState[cellIndex]) return;

    if (currentPlayer === 'Player 1') {
        gameState[cellIndex] = player1Symbol;
    } else {
        gameState[cellIndex] = player2Symbol;
    }
    e.target.textContent = gameState[cellIndex];
    e.target.classList.add('taken');

    const winner = checkWinner();
    if (winner) {
        gameActive = false;
        updateMessage(winner);
    } else {
        currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
        updateMessage(null);

        // Highlight and block a random cell once during the game
        selectAndBlockRandomCellOnce();
    }
}

// Trova una cella vuota
function findEmptyCell() {
    const celleVuote = gameState
        .map((value, index) => (value === null ? index : null)) // Trova celle vuote
        .filter((index) => index !== null); // Rimuove null
    if (celleVuote.length === 0) return null; // Nessuna cella disponibile
    return celleVuote[Math.floor(Math.random() * celleVuote.length)];
}

// Blocca e colora una cella
function blockCell(cellIndex, color) {
    if (cellIndex === null || cellIndex < 0 || cellIndex >= gameState.length) return;

    const cellElement = board.querySelector(`[data-index="${cellIndex}"]`);
    if (cellElement) {
        cellElement.style.backgroundColor = color;
        cellElement.style.pointerEvents = 'none'; // Disabilita click
        cellElement.classList.add('blocked'); // Aggiungi classe opzionale per styling
    }
}

// Scegli e blocca una cella casuale
function selectAndBlockRandomCellOnce() {
    if (!redCellSelected) {
        const randomCellIndex = findEmptyCell(); // Usa la nuova funzione
        if (randomCellIndex !== null) {
            blockCell(randomCellIndex, 'red'); // Colora e blocca la cella
            redCellSelected = true; // Segna la cella come selezionata
        }
    }
}

// Crea la griglia di gioco
function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${numPiazzamenti}, 100px)`;

    for (let i = 0; i < numPiazzamenti * numPiazzamenti; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);

        if (gameState[i]) {
            cell.textContent = gameState[i];
            cell.classList.add('taken');
        }
    }
}

// Resetta il gioco
function resetGame(keepSymbols = false) {
    if (!keepSymbols) {
        gameState.fill(null);
        chooseSymbol();
    }
    gameActive = true;
    currentPlayer = 'Player 1'; // Player 1 inizia
    redCellSelected = false; // Reset the blocked cell
    message.textContent = `Turno di ${currentPlayer}`;
    createBoard();
}

// Cambia la dimensione della griglia
function togglenumPiazzamenti() {
    const newSize = numPiazzamenti === 3 ? 4 : 3; // Alterna tra 3x3 e 4x4
    const newGameState = Array(newSize * newSize).fill(null);

    for (let row = 0; row < Math.min(numPiazzamenti, newSize); row++) {
        for (let col = 0; col < Math.min(numPiazzamenti, newSize); col++) {
            const oldIndex = row * numPiazzamenti + col;
            const newIndex = row * newSize + col;
            newGameState[newIndex] = gameState[oldIndex];
        }
    }

    numPiazzamenti = newSize;
    gameState = newGameState;

    createBoard();
    message.textContent = `Turno di ${currentPlayer}`;
}

// Aggiunge eventi ai bottoni
resetButton.addEventListener('click', () => resetGame());
toggleSizeButton.addEventListener('click', togglenumPiazzamenti);

// Inizializza il gioco
chooseSymbol();
resetGame(true);

// Elementi HTML
const board = document.getElementById('board'); // Tavola di gioco
const message = document.getElementById('message'); // Messaggio per il giocatore
const resetButton = document.getElementById('reset'); // Bottone per resettare la partita
const toggleSizeButton = document.getElementById('toggle-size'); // Bottone per cambiare la dimensione della griglia

// Variabili di gioco
let currentPlayer; // Giocatore corrente
let player1Symbol, player2Symbol; // Simboli scelti dai giocatori
let gridSize = 3; // Dimensione predefinita della griglia (3x3)
let gameState = Array(gridSize * gridSize).fill(null); // Stato iniziale della griglia (vuota)
let gameActive = true; // Indica se il gioco è attivo

// Prompt per chiedere al primo giocatore di scegliere il simbolo
function selectCurrentFirstPlayer() {
    const choice = prompt("Player 1, scegli X o O").toUpperCase(); // Richiesta simbolo
    if (choice !== 'X' && choice !== 'O') { // Verifica se la scelta è valida
        alert("Scelta non valida"); // Messaggio di errore
        selectCurrentFirstPlayer(); // Richiesta ripetuta in caso di errore
    } else {
        player1Symbol = choice; // Imposta il simbolo del giocatore 1
        player2Symbol = player1Symbol === 'X' ? 'O' : 'X'; // Imposta il simbolo del giocatore 2
        currentPlayer = 'Player 1'; // Inizia il gioco con il giocatore 1
    }
}

// Genera dinamicamente le condizioni di vittoria per qualsiasi dimensione della griglia
function generateWinningConditions(gridSize) {
    const consecutive = gridSize === 3 ? 3 : 4; // Determina il numero di simboli consecutivi richiesti (3 per 3x3, 4 per 4x4)
    const conditions = []; // Array delle condizioni di vittoria
    
    // Righe
    for (let row = 0; row < gridSize; row++) {
        for (let start = 0; start <= gridSize - consecutive; start++) {
            const condition = [];
            for (let col = start; col < start + consecutive; col++) {
                condition.push(row * gridSize + col); // Aggiunge gli indici delle celle della riga
            }
            conditions.push(condition); // Aggiunge la condizione di vittoria per la riga
        }
    }
    
    // Colonne
    for (let col = 0; col < gridSize; col++) {
        for (let start = 0; start <= gridSize - consecutive; start++) {
            const condition = [];
            for (let row = start; row < start + consecutive; row++) {
                condition.push(row * gridSize + col); // Aggiunge gli indici delle celle della colonna
            }
            conditions.push(condition); // Aggiunge la condizione di vittoria per la colonna
        }
    }
    
    // Diagonali (alto-sinistra a basso-destra)
    for (let row = 0; row <= gridSize - consecutive; row++) {
        for (let col = 0; col <= gridSize - consecutive; col++) {
            const condition = [];
            for (let i = 0; i < consecutive; i++) {
                condition.push((row + i) * gridSize + (col + i)); // Aggiunge gli indici delle celle lungo la diagonale
            }
            conditions.push(condition); // Aggiunge la condizione di vittoria per la diagonale
        }
    }

    // Diagonali (alto-destra a basso-sinistra)
    for (let row = 0; row <= gridSize - consecutive; row++) {
        for (let col = consecutive - 1; col < gridSize; col++) {
            const condition = [];
            for (let i = 0; i < consecutive; i++) {
                condition.push((row + i) * gridSize + (col - i)); // Aggiunge gli indici delle celle lungo la diagonale
            }
            conditions.push(condition); // Aggiunge la condizione di vittoria per la diagonale
        }
    }

    return conditions; // Ritorna tutte le condizioni di vittoria
}

// Controlla se c'è un vincitore
function checkWinner() {
    const winningConditions = generateWinningConditions(gridSize); // Genera dinamicamente le condizioni di vittoria
    for (const condition of winningConditions) {
        const symbols = condition.map(index => gameState[index]); // Prende i simboli dalle celle coinvolte nella condizione
        if (symbols.every(symbol => symbol !== null && symbol === symbols[0])) { // Se tutte le celle sono uguali e non vuote
            message.textContent = currentPlayer + " has won!"; // Messaggio di vittoria
            gameActive = false; // Disattiva il gioco
            return;
        }
    }
    if (!gameState.includes(null)) { // Controlla se la griglia è piena (Pareggio)
        message.textContent = "The game has been drawn!";
        gameActive = false; // Disattiva il gioco in caso di pareggio
    } else {
        message.textContent = currentPlayer + "'s turn"; // Mostra il turno corrente
    }
}

// Crea la griglia di gioco
function createBoard() {
    board.innerHTML = ''; // Pulisce la griglia precedente
    board.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`; // Imposta la larghezza delle colonne della griglia
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div'); // Crea una nuova cella
        cell.classList.add('cell'); // Aggiunge la classe 'cell' alla cella
        cell.dataset.index = i; // Salva l'indice della cella
        cell.addEventListener('click', handleCellClick); // Aggiunge l'evento di click alla cella
        board.appendChild(cell); // Aggiunge la cella alla griglia
        if (gameState[i]) { // Se la cella è già occupata, visualizza il simbolo
            cell.textContent = gameState[i];
            cell.classList.add('taken'); // Aggiunge la classe 'taken' alla cella
        }
    }
}

// Gestisce i click sulle celle
function handleCellClick(event) {
    const clickedCellIndex = parseInt(event.target.dataset.index); // Ottiene l'indice della cella cliccata
    if (gameState[clickedCellIndex] || !gameActive) return; // Ignora il click se la cella è già occupata o il gioco non è attivo

    const symbol = currentPlayer === 'Player 1' ? player1Symbol : player2Symbol; // Determina il simbolo del giocatore corrente
    gameState[clickedCellIndex] = symbol; // Salva il simbolo nello stato del gioco
    event.target.textContent = symbol; // Mostra il simbolo sulla cella
    event.target.classList.add('taken'); // Aggiunge la classe 'taken' alla cella

    checkWinner(); // Controlla se c'è un vincitore
    if (gameActive) { // Se il gioco è ancora attivo, cambia il turno
        currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
        message.textContent = currentPlayer + "'s turn"; // Mostra il turno del nuovo giocatore
    }
}

// Salva le posizioni attuali dei simboli
function saveCurrentPositions(gameState, gridSize) {
    const savedState = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col; // Calcola l'indice della cella
            if (gameState[index] !== null) { // Se la cella è occupata, salva la posizione
                savedState.push({ value: gameState[index], row, col });
            }
        }
    }
    return savedState; // Ritorna lo stato salvato
}

// Carica le posizioni salvate in una nuova griglia
function loadNewPositions(savedState, newGameState, gridSize, newSize, corner) {
    savedState.forEach(item => {
        let newRow = item.row;
        let newCol = item.col;
        // Adatta le posizioni alle nuove dimensioni della griglia e angolo
        switch (corner) {
            case "top-left":
                break;
            case "top-right":
                newCol += newSize - gridSize; // Aggiusta la colonna per la nuova griglia
                break;
            case "bottom-left":
                newRow += newSize - gridSize; // Aggiusta la riga per la nuova griglia
                break;
            case "bottom-right":
                newRow += newSize - gridSize;
                newCol += newSize - gridSize;
                break;
        }
        if (newRow < newSize && newCol < newSize) {
            const newIndex = newRow * newSize + newCol; // Calcola il nuovo indice
            newGameState[newIndex] = item.value; // Aggiunge il simbolo alla nuova posizione
        }
    });
}

// Ottieni un angolo casuale per riposizionare i simboli
function getRandomCorner() {
    const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
    return corners[Math.floor(Math.random() * corners.length)]; // Scegli un angolo casuale
}

// Resetta il gioco
function resetGame(keepSymbols = false) {
    if (!keepSymbols) {
        selectCurrentFirstPlayer(); // Chiede di nuovo la scelta del simbolo
    }
    gameState = Array(gridSize * gridSize).fill(null); // Resetta lo stato del gioco
    gameActive = true; // Rende il gioco attivo
    createBoard(); // Rende di nuovo la griglia
    message.textContent = currentPlayer + "'s turn"; // Mostra il turno del primo giocatore
}

// Cambia la dimensione della griglia tra 3x3 e 4x4
function toggleGridSize() {
    const newSize = gridSize === 3 ? 4 : 3; // Cambia la dimensione
    const savedState = saveCurrentPositions(gameState, gridSize); // Salva lo stato attuale
    const newGameState = Array(newSize * newSize).fill(null); // Crea un nuovo stato del gioco
    const corner = getRandomCorner(); // Sceglie un angolo casuale
    loadNewPositions(savedState, newGameState, gridSize, newSize, corner); // Carica le posizioni salvate
    gridSize = newSize; // Aggiorna la dimensione della griglia
    gameState = newGameState; // Aggiorna lo stato del gioco
    createBoard(); // Rende di nuovo la griglia
}

// Aggiungi gli eventi per i bottoni
resetButton.addEventListener('click', () => resetGame()); // Bottone per resettare
toggleSizeButton.addEventListener('click', toggleGridSize); // Bottone per cambiare la dimensione

// Inizializza il gioco
resetGame(); 

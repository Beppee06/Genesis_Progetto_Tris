const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const toggleSizeButton = document.getElementById('toggle-size');

let currentPlayer;
let gridSize = 3;
let gameState = Array(gridSize * gridSize).fill(null);
let gameActive = true;

function selectCurrentFirstPlayer() {
    let random = Math.round(Math.random());
    currentPlayer = random === 1 ? 'X' : 'O';
}

const winningConditions3x3 = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const winningConditions4x4 = [
    [0, 1, 2], [1, 2, 3],
    [4, 5, 6], [5, 6, 7],
    [8, 9, 10], [9, 10, 11],
    [12, 13, 14], [13, 14, 15],
    [0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11],
    [4, 8, 12], [5, 9, 13], [6, 10, 14], [7, 11, 15],
    [0, 5, 10], [1, 6, 11],
    [4, 9, 14], [5, 10, 15],
    [2, 5, 8], [3, 6, 9],
    [6, 9, 12], [7, 10, 13]
];

function checkWinner() {
    const winningConditions = (gridSize === 3) ? winningConditions3x3 : winningConditions4x4;
}
function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
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

function resetGame(keepSymbols = false) {
    selectCurrentFirstPlayer();
    gameActive = true;

    if (!keepSymbols) {
        gameState.fill(null);
    }

    message.textContent = "Player " + currentPlayer + "'s turn";
    createBoard();
}

function toggleGridSize() {
    const newSize = (gridSize === 3) ? 4 : 3;
    const newGameState = Array(newSize * newSize).fill(null);

    for (let row = 0; row < Math.min(gridSize, newSize); row++) {
        for (let col = 0; col < Math.min(gridSize, newSize); col++) {
            const oldIndex = row * gridSize + col;
            const newIndex = row * newSize + col;
            newGameState[newIndex] = gameState[oldIndex];
        }
    }

    gridSize = newSize;
    gameState = newGameState;
    resetGame(true);
}

resetButton.addEventListener('click', () => resetGame());
toggleSizeButton.addEventListener('click', toggleGridSize);

// Initialize game
resetGame();
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
    console.log("Current player selected:", currentPlayer);
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
    console.log("Checking winner for grid size:", gridSize);

    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (gridSize === 4 && winCondition[3] !== undefined) {
            let d = gameState[winCondition[3]];
            if (a === b && b === c && c === d && a !== null) {
                roundWon = true;
                break;
            }
        } else if (a === b && b === c && a !== null) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = "Player " + currentPlayer + " has won!";
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes(null);
    if (roundDraw) {
        message.textContent = "Game is a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    message.textContent = "Player " + currentPlayer + "'s turn";
}

function createBoard() {
    console.log("Creating board with grid size:", gridSize);
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

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (gameState[clickedCellIndex] || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('taken');

    checkWinner();
}

function resetGame(keepSymbols = false) {
    console.log("Resetting game. Keep symbols:", keepSymbols);
    selectCurrentFirstPlayer();
    gameActive = true;

    if (!keepSymbols) {
        gameState.fill(null);
    }

    message.textContent = "Player " + currentPlayer + "'s turn";
    createBoard();
}

function getRandomCorner() {
    const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
    return corners[Math.floor(Math.random() * corners.length)];
}

function saveCurrentPositions(gameState, gridSize) {
    const tempState = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            if (gameState[index] !== null) {
                tempState.push({ value: gameState[index], row, col });
            }
        }
    }
    return tempState;
}

function loadNewPositions(tempState, newGameState, gridSize, newSize, corner) {
    tempState.forEach(item => {
        let newRow = item.row;
        let newCol = item.col;

        switch (corner) {
            case "top-left":
                newRow += newSize - gridSize;
                newCol += newSize - gridSize;
                break;
            case "top-right":
                newRow += newSize - gridSize;
                break;
            case "bottom-left":
                newCol += newSize - gridSize;
                break;
        }

        const newIndex = newRow * newSize + newCol;
        if (newIndex < newGameState.length) {
            newGameState[newIndex] = item.value;
        }
    });
}

function toggleGridSize() {
    console.log("Toggling grid size. Current size:", gridSize);
    const newSize = (gridSize === 3) ? 4 : 3;
    const corner = getRandomCorner();
    const tempState = saveCurrentPositions(gameState, gridSize);
    const newGameState = Array(newSize * newSize).fill(null);

    if (newSize < gridSize) {
        // Ridurre la griglia mantenendo i simboli dalle posizioni scelte dall'angolo
        tempState.forEach(item => {
            if (corner === "top-left" && item.row >= 1 && item.col >= 1) {
                const newIndex = (item.row - 1) * newSize + (item.col - 1);
                newGameState[newIndex] = item.value;
            } else if (corner === "top-right" && item.row >= 1 && item.col < gridSize - 1) {
                const newIndex = (item.row - 1) * newSize + item.col;
                newGameState[newIndex] = item.value;
            } else if (corner === "bottom-left" && item.row < gridSize - 1 && item.col >= 1) {
                const newIndex = item.row * newSize + (item.col - 1);
                newGameState[newIndex] = item.value;
            } else if (corner === "bottom-right" && item.row < gridSize - 1 && item.col < gridSize - 1) {
                const newIndex = item.row * newSize + item.col;
                newGameState[newIndex] = item.value;
            }
        });
    } else {
        // Espandere la griglia mantenendo le posizioni relative
        loadNewPositions(tempState, newGameState, gridSize, newSize, corner);
    }

    gridSize = newSize;
    gameState = newGameState;
    resetGame(true);
}

resetButton.addEventListener('click', () => resetGame());
toggleSizeButton.addEventListener('click', toggleGridSize);

// Initialize game
resetGame();
console.log("Game initialized");

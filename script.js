// Variabili globali
let gameState = {
    board: Array.from({ length: 12 }, () => Array(5).fill(null)),
    currentPlayer: 1,
    playerCount: 2,
};

let playerColors = ["red", "blue", "green", "purple", "orange"];

// Funzione per resettare il gioco
function resetGame() {
    gameState.board = Array.from({ length: 12 }, () => Array(5).fill(null));
    gameState.currentPlayer = 1;
    document.getElementById('draw-message').style.display = 'none';
    document.getElementById('new-game-button').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('current-player').textContent = 'Giocatore 1'; // Reset del turno
    createBoard(); // Ricrea la griglia
}

// Funzione per creare la griglia di gioco
function createBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ''; // Pulisce la griglia esistente
    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 5; col++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => makeMove(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

// Funzione per eseguire una mossa
function makeMove(row, col) {
    if (gameState.board[row][col] === null) {
        gameState.board[row][col] = gameState.currentPlayer;
        if (checkWin()) {
            alert(`Giocatore ${gameState.currentPlayer} ha vinto!`);
            resetGame();
        } else if (checkDraw()) {
            document.getElementById('draw-message').style.display = 'block';
            document.getElementById('new-game-button').style.display = 'block';
        } else {
            gameState.currentPlayer = (gameState.currentPlayer % gameState.playerCount) + 1;
            document.getElementById('current-player').textContent = `Giocatore ${gameState.currentPlayer}`;
        }
        updateBoard();
    }
}

// Funzione per aggiornare la griglia di gioco
function updateBoard() {
    const gameBoard = document.getElementById("game-board");
    const cells = gameBoard.getElementsByClassName("cell");
    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 5; col++) {
            let cell = cells[row * 5 + col];
            cell.textContent = gameState.board[row][col] !== null ? gameState.board[row][col] : '';
            if (gameState.board[row][col] !== null) {
                cell.style.color = playerColors[gameState.board[row][col] - 1];
            }
        }
    }
}

// Funzione per controllare se c'è una vittoria
function checkWin() {
    const directions = [
        { x: 1, y: 0 }, // Orizzontale
        { x: 0, y: 1 }, // Verticale
        { x: 1, y: 1 }, // Diagonale crescente
        { x: 1, y: -1 } // Diagonale decrescente
    ];

    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 5; col++) {
            if (gameState.board[row][col] !== null) {
                for (let direction of directions) {
                    const winningCells = [{ row, col }];
                    for (let i = 1; i < 4; i++) {
                        const newRow = row + i * direction.y;
                        const newCol = col + i * direction.x;
                        if (newRow >= 0 && newRow < 12 && newCol >= 0 && newCol < 5 && gameState.board[newRow][newCol] === gameState.board[row][col]) {
                            winningCells.push({ row: newRow, col: newCol });
                        } else {
                            break;
                        }
                    }
                    if (winningCells.length === 4) {
                        highlightWinningCells(winningCells);
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// Funzione per controllare se c'è un pareggio
function checkDraw() {
    return gameState.board.every(row => row.every(cell => cell !== null));
}

// Funzione per evidenziare le celle vincenti
function highlightWinningCells(cells) {
    cells.forEach(cell => {
        let cellElement = document.querySelector(`.cell[data-row='${cell.row}'][data-col='${cell.col}']`);
        if (cellElement) {
            cellElement.classList.add("winning-cell");
        }
    });
    setTimeout(() => {
        cells.forEach(cell => {
            let cellElement = document.querySelector(`.cell[data-row='${cell.row}'][data-col='${cell.col}']`);
            if (cellElement) {
                cellElement.classList.remove("winning-cell");
            }
        });
    }, 3000);
}

// Inizializza il gioco
createBoard();
// Configura Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCuzbRVCzcNHMpvXW3KfbHpndQx3o8anik",
    authDomain: "quater-619ba.firebaseapp.com",
    databaseURL: "https://quater-619ba-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quater-619ba",
    storageBucket: "quater-619ba.firebasestorage.app",
    messagingSenderId: "951738087012",
    appId: "1:951738087012:web:c4c93bc927d3e9d9d7d171"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const gameStateRef = db.ref("gameState");
let gameState = {
    board: Array.from({ length: 12 }, () => Array(5).fill(null)),
    currentPlayer: 1,
    playerCount: 2,
};

gameStateRef.on("value", (snapshot) => {
    if (snapshot.exists()) {
        gameState = snapshot.val();
        updateBoard();
        updatePlayerTurn();
    }
});

function makeMove(row, col) {
    if (gameState.board[row][col] === null) {
        gameState.board[row][col] = gameState.currentPlayer;
        gameState.currentPlayer = (gameState.currentPlayer % gameState.playerCount) + 1;
        gameStateRef.set(gameState);
    }
}

function updateBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = '';
    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 5; col++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = gameState.board[row][col] !== null ? gameState.board[row][col] : '';
            if (gameState.board[row][col] !== null) {
                cell.style.color = playerColors[gameState.board[row][col] - 1];
            }
            cell.addEventListener("click", () => makeMove(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function updatePlayerTurn() {
    const currentPlayerDisplay = document.getElementById("current-player");
    currentPlayerDisplay.textContent = gameState.currentPlayer;
}

const numRows = 12;
const numCols = 5;
let playerColors = ["red", "blue", "green", "purple", "orange"];
let timer, timeLeft = 60;
let gameBoard = document.getElementById("game-board");
let timerDisplayTop = document.getElementById("time-left-top");
let timerDisplayBottom = document.getElementById("time-left-bottom");
let drawMessage = document.getElementById("draw-message");

function createBoard() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", makeMove);
            gameBoard.appendChild(cell);
        }
    }
}

function startTimer() {
    timeLeft = 60;
    timerDisplayTop.textContent = timeLeft;
    timerDisplayBottom.textContent = timeLeft;
    document.getElementById("timer-top").classList.remove("blink");
    document.getElementById("timer-bottom").classList.remove("blink");
    timer = setInterval(() => {
        timeLeft--;
        timerDisplayTop.textContent = timeLeft;
        timerDisplayBottom.textContent = timeLeft;
        if (timeLeft <= 10) {
            document.getElementById("timer-top").classList.add("blink");
            document.getElementById("timer-bottom").classList.add("blink");
        }
        if (timeLeft === 0) {
            clearInterval(timer);
            makeRandomMove();
        }
    }, 1000);
}

function makeRandomMove() {
    let emptyCells = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (gameState.board[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let cellElement = document.querySelector(`.cell[data-row='${randomCell.row}'][data-col='${randomCell.col}']`);
        gameState.board[randomCell.row][randomCell.col] = gameState.currentPlayer;
        cellElement.textContent = gameState.currentPlayer;
        cellElement.style.color = playerColors[gameState.currentPlayer - 1];
        cellElement.style.animation = "blink 0.5s step-start 5";
        if (checkWin()) {
            alert(`Giocatore ${gameState.currentPlayer} ha vinto!`);
            resetGame();
        } else if (checkDraw()) {
            displayDrawMessage();
            setTimeout(resetGame, 5000);
        } else {
            gameState.currentPlayer = (gameState.currentPlayer % gameState.playerCount) + 1;
            gameStateRef.set(gameState);
            startTimer();
        }
    }
}

function checkWin() {
    const directions = [
        { x: 1, y: 0 }, // Orizzontale
        { x: 0, y: 1 }, // Verticale
        { x: 1, y: 1 }, // Diagonale crescente
        { x: 1, y: -1 } // Diagonale decrescente
    ];

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (gameState.board[row][col] !== null) {
                for (let direction of directions) {
                    const winningCells = [{ row, col }];
                    for (let i = 1; i < 4; i++) {
                        const newRow = row + i * direction.y;
                        const newCol = col + i * direction.x;
                        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && gameState.board[newRow][newCol] === gameState.board[row][col]) {
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

function checkDraw() {
    return gameState.board.every(row => row.every(cell => cell !== null));
}

function displayDrawMessage() {
    drawMessage.classList.remove("hidden");
    drawMessage.classList.add("blink");
    setTimeout(() => {
        drawMessage.classList.add("hidden");
    }, 5000); // La scritta "PAREGGIO" lampeggia per 5 secondi
}

function highlightWinningCells(cells) {
    cells.forEach(cell => {
        let cellElement = document.querySelector(`.cell[data-row='${cell.row}'][data-col='${cell.col}']`);
        cellElement.classList.add("winning-cell");
    });
    setTimeout(() => {
        cells.forEach(cell => {
            let cellElement = document.querySelector(`.cell[data-row='${cell.row}'][data-col='${cell.col}']`);
            cellElement.classList.remove("winning-cell");
        });
    }, 3000); // Le celle vincenti lampeggiano per 3 secondi
}

function resetGame() {
    gameState.board = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "";
        cell.style.animation = "";
    });
    gameState.currentPlayer = 1;
    const currentPlayerDisplay = document.getElementById("current-player");
    currentPlayerDisplay.textContent = gameState.currentPlayer;
    startTimer();
}

createBoard();
startTimer();


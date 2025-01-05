const numRows = 12;
const numCols = 5;
let currentPlayer = 1;
let playerCount = prompt("Quanti giocatori? (2 o più)");
let playerColors = ["red", "blue", "green", "purple", "orange"];
let board = Array.from({ length: numRows }, () => Array(numCols).fill(null));
let timer, timeLeft = 60;
let gameBoard = document.getElementById("game-board");
let currentPlayerDisplay = document.getElementById("current-player");
let timerDisplay = document.getElementById("time-left");

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

function makeMove(e) {
    clearInterval(timer);
    let row = e.target.dataset.row;
    let col = e.target.dataset.col;
    if (board[row][col] === null) {
        board[row][col] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.style.color = playerColors[currentPlayer - 1];
        if (checkWin()) {
            alert(`Giocatore ${currentPlayer} ha vinto!`);
            resetGame();
        } else {
            switchPlayer();
            startTimer();
        }
    }
}

function switchPlayer() {
    currentPlayer = (currentPlayer % playerCount) + 1;
    currentPlayerDisplay.textContent = currentPlayer;
}

function startTimer() {
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    timerDisplay.classList.remove("blink");
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 10) {
            timerDisplay.classList.add("blink");
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
            if (board[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let cellElement = document.querySelector(`.cell[data-row='${randomCell.row}'][data-col='${randomCell.col}']`);
        board[randomCell.row][randomCell.col] = currentPlayer;
        cellElement.textContent = currentPlayer;
        cellElement.style.color = playerColors[currentPlayer - 1];
        cellElement.style.animation = "blink 0.5s step-start 5";
        if (checkWin()) {
            alert(`Giocatore ${currentPlayer} ha vinto!`);
            resetGame();
        } else {
            switchPlayer();
            startTimer();
        }
    }
}

function checkWin() {
    // Controlla se ci sono 4 simboli uguali allineati (orizzontale, verticale o diagonale)
    return false; // Implementa la logica di controllo della vittoria
}

function resetGame() {
    board = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "";
        cell.style.animation = "";
    });
    currentPlayer = 1;
    currentPlayerDisplay.textContent = currentPlayer;
    startTimer();
}

createBoard();
startTimer();

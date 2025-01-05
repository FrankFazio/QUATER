const numRows = 12;
const numCols = 5;
let currentPlayer = 1;
let playerCount = prompt("Quanti giocatori? (2 o più)");
let playerColors = ["red", "blue", "green", "purple", "orange"];
let board = Array.from({ length: numRows }, () => Array(numCols).fill(null));
let timer, timeLeft = 60;
let gameBoard = document.getElementById("game-board");
let currentPlayerDisplay = document.getElementById("current-player");
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
        } else if (checkDraw()) {
            displayDrawMessage();
            setTimeout(resetGame, 5000);
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
        } else if (checkDraw()) {
            displayDrawMessage();
            setTimeout(resetGame, 5000);
        } else {
            switchPlayer();
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
            if (board[row][col] !== null) {
                for (let direction of directions) {
                    const winningCells = [{ row, col }];
                    for (let i = 1; i < 4; i++) {
                        const newRow = row + i * direction.y;
                        const newCol = col + i * direction.x;
                        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && board[newRow][newCol] === board[row][col]) {
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
    return board.every(row => row.every(cell => cell !== null));
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

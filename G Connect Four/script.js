const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;

const gameBoard = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

// Initialize the board
function initBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
    gameBoard.innerHTML = '';
    gameOver = false;
    currentPlayer = 'red';
    statusText.textContent = "Player 1's turn (Red)";

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            gameBoard.appendChild(cell);
        }
    }
}
initBoard();

// Handle clicks on the game board
gameBoard.addEventListener('click', (e) => {
    if (gameOver) return;

    const col = parseInt(e.target.dataset.col);
    if (!col) return;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;

            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add(currentPlayer);

            // Check for a win
            if (checkWin(row, col)) {
                statusText.textContent = `Player ${currentPlayer === 'red' ? 1 : 2} wins!`;
                gameOver = true;
                return;
            }

            // Check for a draw
            if (board.flat().every(cell => cell)) {
                statusText.textContent = "It's a draw!";
                gameOver = true;
                return;
            }

            // Switch turn
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            statusText.textContent = `Player ${currentPlayer === 'red' ? 1 : 2}'s turn (${currentPlayer})`;
            break;
        }
    }
});

// Check if current move results in win
function checkWin(row, col) {
    const color = board[row][col];
    return checkDirection(row, col, 0, 1, color) || // horizontal
        checkDirection(row, col, 1, 0, color) || // vertical
        checkDirection(row, col, 1, 1, color) || // diagonal down-right
        checkDirection(row, col, 1, -1, color);  // diagonal down-left
}

function checkDirection(row, col, dr, dc, color) {
    let count = 1;
    count += countMatches(row, col, dr, dc, color);
    count += countMatches(row, col, -dr, -dc, color);
    return count >= 4;
}

function countMatches(r, c, dr, dc, color) {
    let count = 0;
    for (let i = 1; i < 4; i++) {
        const nr = r + dr * i;
        const nc = c + dc * i;
        if (
            nr >= 0 && nr < ROWS && 
            nc >= 0 && nc < COLS && 
            board[nr][nc] === color
        ){
            count++;
        } else {
            break;
        }
    }
    return count;
}

// Restart button logic
restartBtn.addEventListener('click', initBoard);

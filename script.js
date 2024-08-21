const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const resetScoresButton = document.getElementById('resetScoresButton');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let firstGame = true; // Track if it's the first game
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleClick = (e) => {
    const cell = e.target;
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
        cell.classList.add('cell-played'); // Add class for animation
        if (checkWin(currentPlayer)) {
            const playerName = currentPlayer === 'X' ? (player1Input.value || 'Player X') : (player2Input.value || 'Player O');
            messageElement.textContent = `${playerName} wins!`;
            scores[currentPlayer]++;
            updateScores();
            highlightWin(currentPlayer);
            cells.forEach(cell => cell.removeEventListener('click', handleClick));
            vibrate(200);
        } else if (isDraw()) {
            messageElement.textContent = "It's a draw!";
            vibrate(100);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            vibrate(50);
        }
    }
};

const checkWin = (player) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === player;
        });
    });
};

const isDraw = () => {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
};

const restartGame = () => {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('highlight', 'cell-played');
        cell.addEventListener('click', handleClick);
    });
    // Alternate starting player for new games
    if (firstGame) {
        currentPlayer = 'O';
        firstGame = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
    messageElement.textContent = '';
};

const updateScores = () => {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
};

const resetScores = () => {
    scores = { X: 0, O: 0 };
    updateScores();
    restartGame();
};

const highlightWin = (player) => {
    winningCombinations.forEach(combination => {
        if (combination.every(index => cells[index].textContent === player)) {
            combination.forEach(index => {
                cells[index].classList.add('highlight');
                cells[index].classList.remove('cell-played'); // Remove played animation class
            });
        }
    });
};

const vibrate = (duration) => {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
resetScoresButton.addEventListener('click', resetScores);

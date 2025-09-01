const EMPTY = "";

function Player(name, marker) {
    return { name, marker };
}

function GameBoard() {
    const size = 3
    const board = [];

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i].push(Cell());
        }
    }

    const placeMarker = (row, column, marker) => {
        // Add marker
        const cell = board[row][column];
        if (cell.isEmpty()) {
            cell.setValue(marker);
            return true;
        }
        else {
            return false;
        }
    };
    const getBoard = () => board.map((row) => row.map((cell) => cell.getValue()));
    const resetBoard = () => {
        board.flat().forEach(cell => cell.reset());
    };

    return { getBoard, placeMarker, resetBoard };
}

function Cell() {
    let value = EMPTY;
    const isEmpty = () => value === EMPTY;
    const setValue = (newValue) => {
        value = newValue;
    };
    const getValue = () => value;
    const reset = () => { value = EMPTY };

    return { setValue, getValue, reset, isEmpty };
}

function GameController(p1_name = "Player 1", p2_name = "Player 2") {
    const players = [
        Player(p1_name, "X"),
        Player(p2_name, "O")
    ];
    const myBoard = GameBoard();

    let activePlayer = players[0];
    let gameStatus = 'Press start game';
    let isGameOver = true;

    const startNewGame = () => {
        if (!isGameOver) return;
        myBoard.resetBoard();
        activePlayer = players[0];
        gameStatus = `${activePlayer.name}'s Turn`;
        isGameOver = false;
    }
    const getGameStatus = () => gameStatus;
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const playRound = (row, column) => {
        if (isGameOver) return;

        if (myBoard.placeMarker(row, column, activePlayer.marker)) {
            switch (winCheck()) {
                case 1:
                    gameStatus = `${activePlayer.name} Won`;
                    isGameOver = true;
                    break;
                case 0:
                    switchPlayerTurn();
                    gameStatus = `${activePlayer.name}'s Turn`;
                    break;
                case -1:
                    gameStatus = "It's a Tie";
                    isGameOver = true;
                    break;
                default:
                    break;
            }
        }
    }

    function winCheck() {
        // Check for winner/tie
        const board = myBoard.getBoard();
        const size = board.length;
        const result = {
            "win": 1,
            "noWin": 0,
            "tie": -1
        };

        // Helper to check if all elements in an array are the same and not "0"
        const allEqual = arr => arr.every(val => val !== EMPTY && val === arr[0]);

        // Check rows
        for (let row = 0; row < size; row++) {
            if (allEqual(board[row])) {
                return result.win;
            }
        }

        // Check columns
        for (let col = 0; col < size; col++) {
            const column = board.map(row => row[col]);
            if (allEqual(column)) {
                return result.win;
            }
        }

        // Check diagonals
        const mainDiag = board.map((row, i) => row[i]);
        const antiDiag = board.map((row, i) => row[size - 1 - i]);

        if (allEqual(mainDiag)) {
            return result.win;
        }

        if (allEqual(antiDiag)) {
            return result.win;
        }

        // Check tie (board full, no "0")
        const isTie = board.flat().every(cell => cell !== EMPTY);
        if (isTie) {
            return result.tie;
        }

        return result.noWin;
    }

    return { startNewGame, getGameStatus, playRound, getBoard: myBoard.getBoard };
}

// Screen Controller
function ScreenController() {
    const game = GameController();

    // Grab dom elements
    const boardDiv = document.querySelector('.game-board');
    const gameStatusDiv = document.querySelector('.game-status');
    const gameStartBtn = document.querySelector('.start-btn');

    // Create board elements
    const updateScreen = () => {
        boardDiv.textContent = EMPTY;
        const board = game.getBoard();
        const gameStatus = game.getGameStatus();

        gameStatusDiv.textContent = gameStatus;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add('board-btn');
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell;
                boardDiv.appendChild(cellButton);
            })
        });
    }

    // Event Listener
    boardDiv.addEventListener("click", (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    });

    gameStartBtn.addEventListener("click", () => {
        game.startNewGame();
        updateScreen();
    });

    updateScreen();
}

ScreenController();
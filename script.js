// Base factories
// Player, game board, game controller

// Factories
function createPlayer(name, marker) {
    return { name, marker };
}

function createBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(createCell());
        }
    }

    const getBoard = () => board;
    const placeMarker = (row, column, marker) => {
        // Check if valid index
        if (row >= rows || row < 0 || column >= columns || column < 0) {
            return;
        }
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
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, placeMarker, printBoard };
}

function createCell() {
    const defaultValue = '0';
    let value = defaultValue;
    const isEmpty = () => value === defaultValue;
    const setValue = (newValue) => {
        value = newValue;
    };
    const getValue = () => value;

    return { setValue, getValue, isEmpty };
}

function createGameController(p1_name = "Player 1", p2_name = "Player 2") {
    const players = [
        createPlayer(p1_name, "X"),
        createPlayer(p2_name, "O")
    ];
    const myBoard = createBoard();

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        myBoard.printBoard();
        console.log(`${activePlayer.name}'s turn`);
    }
    const playRound = (row, column) => {
        if (myBoard.placeMarker(row, column, getActivePlayer().marker)) {
            // Check for winner/tie
            console.log(`${activePlayer.name} placed mark at \nRow:${row} Col:${column}`);
            switchPlayerTurn();
        }
        else {
            console.log("Invalid Move");
        }
        printNewRound();
    }

    // Initial round
    printNewRound();

    return { playRound };
}

// Object
const gameController = createGameController();
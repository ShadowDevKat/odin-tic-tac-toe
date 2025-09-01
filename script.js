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
    const getBoardValues = () => board.map((row) => row.map((cell) => cell.getValue()));
    const printBoard = () => {
        console.log(getBoardValues());
    };

    return { getBoard, getBoardValues, placeMarker, printBoard };
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
    let isGameOver = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        myBoard.printBoard();
        console.log(`${activePlayer.name}'s turn`);
    }
    const playRound = (row, column) => {
        if (isGameOver) return;

        if (myBoard.placeMarker(row, column, getActivePlayer().marker)) {
            switch (winCheck()) {
                case 1:
                    myBoard.printBoard();
                    console.log(`${activePlayer.name} Won`);
                    isGameOver = true;
                    break;
                case 0:
                    console.log(`${activePlayer.name} placed mark at \nRow:${row} Col:${column}`);
                    switchPlayerTurn();
                    printNewRound();
                    break;
                case -1:
                    myBoard.printBoard();
                    console.log("It's a Tie");
                    isGameOver = true;
                    break;
                default:
                    break;
            }
        }
        else {
            console.log("Invalid Move");
        }
    }

    function winCheck() {
        // Check for winner/tie
        const board = myBoard.getBoardValues();
        const size = board.length;
        const result = {
            "win": 1,
            "noWin": 0,
            "tie": -1
        };

        // Helper to check if all elements in an array are the same and not "0"
        const allEqual = arr => arr.every(val => val !== "0" && val === arr[0]);

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
        const isTie = board.flat().every(cell => cell !== "0");
        if (isTie) {
            return result.tie;
        }

        return result.noWin;
    }

    // Initial round
    printNewRound();

    return { playRound };
}

// Object
const gameController = createGameController();
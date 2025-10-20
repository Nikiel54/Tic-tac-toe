// Game logic
const P1COLOUR = "#8A2BE2";
const P2COLOUR = "#00FFFF";

const gameBoard = (() => {
    const length = 3;
    const width = 3;
    let Board = buildBoard();

    function buildBoard() { return Array.from({ length: width }, () => Array(width).fill(".")); };

    const resetBoard = () => {
        Board = buildBoard();
    }

    const displayBoard = () => {
        console.log('Board:')
        for (let i = 0; i < length; i++) {
            console.log(Board[i]);
        }
        console.log();
    }

    const checkWinner = (row, col) => {
        const currPlayer = Board[row][col];

        // check horizontally
        let rowWin = true;
        for (let i = 0; i < width; i++) {
            rowWin = rowWin && (currPlayer === Board[row][i]);
        }

        // check vertically
        let colWin = true;
        for (let i = 0; i < length; i++) {
            colWin = colWin && currPlayer === Board[i][col];
        }

        // forward diagonally
        let fwdDiagWin = true;
        for (let i = length - 1; i >= 0; i--) {
            for (let j = 0; j < width; j++) {
                fwdDiagWin = fwdDiagWin && currPlayer === Board[i][j];
            }
        }

        // backwards diagonally
        let bckDiagWin = true;
        for (let i = 0; i < width; i++) {
            bckDiagWin = bckDiagWin && currPlayer === Board[i][i];
        }

        if (rowWin) { console.log("row win"); };

        return rowWin || colWin || fwdDiagWin || bckDiagWin; // checks if any possible wins happened
    }

    const move = (row, col, playerType) => {
        // assumes valid moves only

        Board[row][col] = playerType; // make move

        const playerWon = checkWinner(row, col);
        if (playerWon) {
            return true;
        }
        return false;
    }

    const checkValidMove = (row, col) => {
        if (!(Board[row][col] === '.')) {
            return false;
        } else {
            return true;
        }
    }

    return {
        checkValidMove,
        move,
        displayBoard,
        resetBoard,
    }
})();


function Player(name, playerType) {
    this.name = name;
    this.playerType = playerType;
}

const gameController = (() => {
    const player1 = new Player('Toad', 'X');
    const player2 = new Player('Jacob', 'O');
    let movesMade = 0;
    const maxMoves = 9;
    
    let currPlayer = player1;
    
    const playMove = (row, col) => {
        const canMove = gameBoard.checkValidMove(row, col);

        // early termination
        if (!canMove) {
            console.log("Error: Invalid move!");
            return;
        }

        const win = gameBoard.move(row, col, currPlayer.playerType);
        movesMade++;
        gameBoard.displayBoard();

        if (win) {
            console.log(`Player ${currPlayer.name} wins!!!\n`);
        }
        else if (movesMade >= maxMoves) {
            console.log("Both Players Draw!!!");
        }
        else {
            // switching players
            if (currPlayer === player1) {
                currPlayer = player2;
            } else {
                currPlayer = player1;
            }
        }
    }

    const whoAmI = () => { 
        console.log(`Current player: ${currPlayer.name}`);
        return currPlayer;
    };

    const reset = () => {
        movesMade = 0;
        gameBoard.resetBoard();
    }

    return {
        playMove,
        whoAmI,
        reset,
    }
})();



const displayController = (() => {
    const cells = document.querySelectorAll(".cell[data-id]");
    const borders = document.querySelectorAll(".border");
    const turnDisplay = document.getElementById("turn-display");

    // private functions
    const flashCell = (row, col) => {
        const ind = row * 3 + col;
        const reqdCell = document.querySelector(`.cell[data-id="${ind}"]`);

        reqdCell.classList.add("flash");
        setTimeout(() => {
            reqdCell.classList.remove("flash");
        }, 300);
    }


    const updateCell = (row, col, symbol, colour) => {
        const ind = row * 3 + col;
        const reqdCell = document.querySelector(`.cell[data-id="${ind}"]`);

        if (reqdCell.textContent !== '') {
            flashCell(row, col);
            throw("Error: Invalid Placement!");
        }

        reqdCell.textContent = symbol;
        reqdCell.style.color = colour;
    }

    const setBorderColour = (colour) => {
        borders.forEach((border) => {
            border.style["background-color"] = colour;
        })
    }

    const updateTurnDisplay = (name, colour) => {
        const displayMsg = `Player ${name}'s Turn`;
        turnDisplay.textContent = displayMsg;
        turnDisplay.style.color = colour;
    }

    const clearBoard = () => {
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.style.color = '';
        })
    }


    // Public functions
    const setEventListeners = () => {
        cells.forEach((cell) => {
            const index = +cell.getAttribute("data-id");
            const rowIndex = Math.floor(index / 3);
            const colIndex = index % 3;

            cell.addEventListener('click', () => {
                const player = gameController.whoAmI()

                const playerSymbol = player.playerType;
                const colour = playerSymbol === 'X' ? P1COLOUR : P2COLOUR;

                updateCell(rowIndex, colIndex, playerSymbol, colour);

                const newColour = colour === P1COLOUR ? P2COLOUR : P1COLOUR;
                setBorderColour(newColour);

                gameController.playMove(rowIndex, colIndex);

                const newPlayer = gameController.whoAmI();
                updateTurnDisplay(newPlayer.name, newColour);
            })
        })
    }


    return {
        clearBoard,
        setEventListeners,
    }
})();



displayController.setEventListeners();



/*
gameController.whoAmI();
gameController.playMove(2, 2);
gameController.whoAmI();
gameController.playMove(1, 2);
gameController.whoAmI();
gameController.playMove(0, 2);
gameController.whoAmI();
*/




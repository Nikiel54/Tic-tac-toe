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
    const player1 = new Player('Me', 'X');
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
        return currPlayer.playerType;
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


const cells = document.querySelectorAll(".cell[data-id]");
cells.forEach((cell) => {
    const index = +cell.getAttribute("data-id");
    let rowIndex = Math.floor(index / 3);
    if (rowIndex === 3) {
        rowIndex--;
    }
    const colIndex = index % 3;

    cell.addEventListener('click', () => {
        const playerSignature = gameController.whoAmI()
        gameController.playMove(rowIndex, colIndex);

        const moveMade = document.createElement('h1');
        moveMade.textContent = playerSignature;
        if (playerSignature == 'X') {
            moveMade.style.color = P1COLOUR;
        } else {
            moveMade.style.color = P2COLOUR;
        }

        cell.appendChild(moveMade);
    })
})





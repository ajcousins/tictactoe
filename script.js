// gameBoard module
const gameBoard = (() => {
    const squares = []
        for (let i = 0; i < 3; i ++) {
            for (let j = 0; j < 3; j++) {
                let div = document.querySelector(`.s${i}${j}`);
                div.addEventListener("click", function () {
                    playerAction(`${i}${j}`);
                });
                let square = {coord: `${i}${j}`, mark: "", div: div};
                squares.push(square);
            }
        }
    
    return {squares};
})();

function playerAction (coord) {
    // Check if square is already filled.
    let index = gameBoard.squares.findIndex(item => item.coord === coord);

    // If already filled: pass.
    if (gameBoard.squares[index].mark != "") return null;

    if (gameFlow.turn == 1) {
        gameBoard.squares[index].mark = "X";
        gameBoard.squares[index].div.innerHTML = `<img src="static/X_02.png">`
        if (checkStatus("X")) {
            console.log("X wins");
            gameFlow.changeTurn();
        } else {
            gameFlow.changeTurn("playerTwo")
        }
        
    } else if (gameFlow.turn == 2) {
        gameBoard.squares[index].mark = "O";
        gameBoard.squares[index].div.innerHTML = `<img src="static/O_02.png">`
        if (checkStatus("O")) {
            console.log("O wins");
            gameFlow.changeTurn();
        } else {
            gameFlow.changeTurn("playerOne")
        }
    }
}

// Player factory function
const player = (playerName, symbol) => {
    const mark = (coord) => {
        let index = gameBoard.squares.findIndex(item => item.coord === coord);
        gameBoard.squares[index].mark = `${symbol}`;
        console.log(`${coord} marked ${symbol}`);
    };
    return {playerName, symbol, mark}
}

// Initialise players
const playerOne = player("playerOne", "X");
const playerTwo = player("playerTwo", "O");


// gameFlow module
const gameFlow = (() => {
    let turn = 1;
    
    const changeTurn = function (player) {
        let textDisplay = document.querySelector("#textDisplay");
        if (player == "playerOne") {
            this.turn = 1;
            textDisplay.textContent = "Player 1's turn: X";
        } else if (player == "playerTwo") {
            this.turn = 2;
            textDisplay.textContent = "Player 2's turn: O";
        } else {
            this.turn = 0;
        }
    }

    return {turn, changeTurn};
})();


function checkStatus (X) {

    // Check for draw
    let count = 0;
    for (let i = 0; i < gameBoard.squares.length; i++) {
        if (gameBoard.squares[i].mark == "") {
            count++;
        } 
    }
    if (count === 0) console.log("Draw!");

    const winningBoard = [
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 0],
    ];

    for (let i = 0; i < 8; i++) {
        let count = 0;
        for (let j = 0; j < 9; j++) {
            if (gameBoard.squares[j].mark == X && winningBoard[i][j] === 1) {
                count++;
            }
        }
        if (count === 3) {
            return true;
            }
    }
}
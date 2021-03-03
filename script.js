'use strict';
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
    
        const current = () => {
            let current = [];
            for (let i = 0; i < 9; i++) {
                current.push(squares[i].mark);
            }
            return current;
        }
    
    return {squares, current};
})();

function playerAction (coord) {
    //console.log(coord);
    // Check if square is already filled.
    let index = gameBoard.squares.findIndex(item => item.coord === coord);

    // If already filled: pass.
    if (gameBoard.squares[index].mark != "") return null;

    // If game has ended: pass.
    if (gameFlow.turn === 0) return null;

    if (gameFlow.turn == 1) {
        gameBoard.squares[index].mark = "X";
        gameBoard.squares[index].div.innerHTML = `<img src="static/X_02.png">`
        if (checkWin("X")) {
            gameFlow.changeTurn("1");
        } else if (checkDraw()) {
            gameFlow.changeTurn("Draw");
        } else {
            gameFlow.changeTurn("playerTwo")
        }
    } else {
        gameBoard.squares[index].mark = "O";
        gameBoard.squares[index].div.innerHTML = `<img src="static/O_02.png">`
        if (checkWin("O")) {
            gameFlow.changeTurn("2");
        } else if (checkDraw()) {
            gameFlow.changeTurn("Draw");
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
        if (player == "Draw") {
            this.turn = 0;
            textDisplay.textContent = "Draw";
            document.querySelector("#tryAgain").innerHTML = "Try Again?"
        } else if (player == 1 || player == 2) {
            this.turn = 0;
            textDisplay.textContent = `Player ${player} Wins!`;
            document.querySelector("#tryAgain").innerHTML = "Try Again?"
        } else if (player == "playerOne") {
            this.turn = 1;
            textDisplay.textContent = "Player 1's turn: X";
            if (opponent.getOpp1() === 1) {
                AIController(1);
            }
            if (opponent.getOpp1() === 2) {
                AIController(2);
            }
        } else if (player == "playerTwo") {
            this.turn = 2;
            textDisplay.textContent = "Player 2's turn: O";
            //console.log("here");
            if (opponent.getOpp2() === 1) {
                AIController(1);
            }
            if (opponent.getOpp2() === 2) {
                AIController(2);
            }
        } 
    }
    return {turn, changeTurn};
})();


const checkDraw = () => {
    let count = 0;
    for (let i = 0; i < gameBoard.squares.length; i++) {
        if (gameBoard.squares[i].mark == "") {
            count++;
        } 
    }
    if (count === 0) return true;
}

const checkWin = (X) => {
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
            highlight(winningBoard[i], X);
            return true;
            }
    }
}

const highlight = (pattern, mark) => {
    for (let i = 0; i < 9; i ++) {
        if (pattern[i] === 1) {
            gameBoard.squares[i].div.classList.add(`highlight${mark}`)
        }
    }
}


// opponent selection module
const opponent = (() => {
    let opp1 = 0;
    let opp2 = 0;
    const getOpp1 = () => opp1;
    const getOpp2 = () => opp2;
    const change1 = document.querySelector(".changeOpp1")
    const change2 = document.querySelector(".changeOpp2")
    
    const display = (text, value) => {
        if (value === 1) {
            document.querySelector(`.${text}`).textContent = "Easy Computer"
            if (text == "opp1") {
                textDisplay.textContent = "Start AI";
            }
        } else if (value === 2) {
            document.querySelector(`.${text}`).textContent = "Hard Computer"
            if (text == "opp1") {
                textDisplay.textContent = "Start AI";
            }
        } else {
            document.querySelector(`.${text}`).textContent = "Human"
            if (text == "opp1") {
                textDisplay.textContent = "Player 1's turn: X";
            }
        }
    }

    function nextOpp(n) {
        console.log("here");
        if (n == 1) {
            if (opp1 == 2) {
                opp1 = 0;
            }
            else opp1 += 1;
            display("opp1", opp1)
        } else if (n == 2) {
            if (opp2 == 2) {
                opp2 = 0;
            }
            else opp2 += 1;
            display("opp2", opp2)
        } 
    }

    change1.addEventListener("click", () => nextOpp(1));
    change2.addEventListener("click", () => nextOpp(2));


    return {getOpp1, getOpp2};
})();


function AIController () {
    console.log("AI Hard do something.")
    console.log(minimax(gameBoard.current()).bestMove.move);
    const coords = ["00", "01", "02", "10", "11", "12", "20", "21", "22"]
    const move = minimax(gameBoard.current()).bestMove.move[1]
    
    setTimeout(function() {
        playerAction(coords[move]);
        highlightSquare(move);
    }, 1000);

}

function highlightSquare (move) {
    const grid = ["s00", "s01", "s02", "s10", "s11", "s12", "s20", "s21", "s22"]
    
    console.log("Highlight", grid[move]);

    //// Where I left off...
}



// Easy AI Module
const easyAI = (() => {
    const move = () => {
        console.log(gameBoard.current());
    }
    return {move};
})();

const playerToMove = (board) => {
    let countX = 0;
    let countO = 0;
    for (let i = 0; i < 9; i++) {
        if (board[i] == "X") {
            countX++;
        }
        if (board[i] == "O") {
            countO++;
        }
    }
    if (countX > countO) {
        return "O";
    } else {
        return "X";
    }
}

// Returns array indices of possble moves.
const actionsList = (board) => {
    let set = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            set.push(`s${i}`);
        }
    }
    return set
}

// Takes a board and action as input and returns a new board state.
const result = (board, action) => {
    let index = action[1];
    let mark;
    let newBoard = []
    for (let i = 0; i < 9; i++) {
        newBoard.push(board[i]);
    }

    if (playerToMove(board) === "X") {
        mark = "X"
    } else {
        mark = "O"
    }
    if (board[index] != "") {
        return "Not allowed"
    } else {
        newBoard.splice(index, 1, mark);
    }

    return newBoard;
}

// Takes a board and returns the winner of the board if there is one.
const winner = (board) => {
    let winner = null;
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

    for (let h = 0; h < 2; h++) {
        let mark;
        h === 0 ? mark = "X" : mark = "O";
        for (let i = 0; i < 8; i++) {
            let count = 0;
            for (let j = 0; j < 9; j++) {
                if (board[j] == mark && winningBoard[i][j] === 1) {
                    count++;
                }
            }
            if (count === 3) {
                winner = mark;
            }
        }

    }
    return winner;
}
// Returns boolean whether the game is over or not.
const terminal = (board) => {
    if (winner(board)) {
        return true
    } 
    if (!board.includes("")) {
        return true
    }
    return false
}

// Accepts board as input, outputs the utiliy: -1, 0, 1.
const utility = (board) => {
    if (winner(board) === "X") {
        return 1;
    } else if (winner(board) === "O") {
        return -1;
    } else if (terminal(board) === true) {
        return 0;
    }
}

// Minimax: takes board as input and outputs optimal move.
const minimax = (board) => {
    
    // Check whose move. Sets varable to X or O.
    const currentPlayer = playerToMove(board);
    let bestMove;

    if (currentPlayer == "X") {
        bestMove = maxValue(board);
        //console.log(maxValue(copyBoard));
    } else {
        bestMove = minValue(board);
    }

    function maxValue(state) {
        if (terminal(state)) {
            return {value: utility(state)};
        }
        let legalMoves = actionsList(state);
        let v = -Infinity;
        let move;
        // For each legal move...
        for (let i = 0; i < legalMoves.length; i++) {

            //debugger;
            let check = minValue(result(state, legalMoves[i])).value
            if (check > v) {
                v = check;
                move = legalMoves[i];
            }
        }
        return {value: v, move: move}
    }

    function minValue(state) {
        if (terminal(state)) {
            return {value: utility(state)};
        }
        let legalMoves = actionsList(state);
        let v = Infinity;
        let move;
        // For each legal move...
        for (let i = 0; i < legalMoves.length; i++) {

            //debugger;
            let check = maxValue(result(state, legalMoves[i])).value
            if (check < v) {
                v = check;
                move = legalMoves[i];
            }
        }
        return {value: v, move: move}
    }
    
    //console.log(copyBoard);
    // return {currentPlayer, board, actions, util, move};
    return {bestMove};

}

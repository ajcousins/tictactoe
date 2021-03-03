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
        } else if (player == "playerTwo") {
            this.turn = 2;
            textDisplay.textContent = "Player 2's turn: O";
            //console.log("here");
            if (opponent.getOpp() === 1) {
                console.log(easyAI.move());
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
    let opp = 0;
    const getOpp = () => opp;
    const change = document.querySelector(".changeOpp")
    change.addEventListener("click", nextOpp);

    function nextOpp() {
        if (opp == 2) {
            opp = 0;
        }
        else opp += 1;
        display()
        console.log(opp)
    }
    
    const display = () => {
        if (opp === 1) {
            document.querySelector(".opp").textContent = "Easy Computer"
            computer = "Easy Computer";
        } else if (opp === 2) {
            document.querySelector(".opp").textContent = "Unbeatable AI"
        } else {
            document.querySelector(".opp").textContent = "Human"
        }
    }
    return {getOpp};
})();

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
    let newBoard = board;
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
        return 10;
    } else if (winner(board) === "O") {
        return -10;
    } else if (terminal(board) === true) {
        return 0;
    }
}

// Minimax: takes board as input and outputs optimal move.
const minimax = (board) => {
    
    // Check whose move. Sets varable to X or O.
    const copyBoard = board;
    //console.log(copyBoard);
    const currentPlayer = playerToMove(copyBoard);
    let bestMove;

    if (currentPlayer == "X") {
        bestMove = maxValue(copyBoard);
        //console.log(maxValue(copyBoard));
    } else {
        bestMove = minValue(copyBoard);
    }

    function maxValue(state) {
        //debugger;
        if (terminal(state)) {
            //console.log("terminal?", terminal(state));
            return {singleValue: utility(state)};
        }
        let legalMoves = actionsList(state);
        let v = -10;
        let move;
        let moves = [];
        let singleMove;
        let singleValue;
        // For each legal move...
        for (let i = 0; i < legalMoves.length; i++) {
            
            let check = minValue(result(state, legalMoves[i])).singleValue
            move = {value: check, move: legalMoves[i]};
            moves.push(move);
        }
        console.log(moves);
        highestLoop:
        for (let j = 0; j < moves.length; j++) {
            if (moves[j].value == 10) {
                singleMove = moves[j].move;
                singleValue = 10;
                break highestLoop;
            } else if (moves[j].value == 0) {
                singleMove = moves[j].move;
                singleValue = 0;
                break highestLoop;
            } else {
                singleMove = moves[j].move;
                singleValue = -10;
            }
        }
        return {singleValue, singleMove}
    }

    function minValue(state) {
        if (terminal(state)) {
            return {singleValue: utility(state)};
        }
        let legalMoves = actionsList(state);
        let v = 10;
        let move;
        let moves = [];
        let singleMove;
        let singleValue;
        // For each legal move...
        for (let i = 0; i < legalMoves.length; i++) {

            let check = maxValue(result(state, legalMoves[i])).singleValue
            move = {value: check, move: legalMoves[i]};
            moves.push(move);
        }
        console.log(moves);
        lowestLoop:
        for (let j = 0; j < moves.length; j++) {
            if (moves[j].value == -10) {
                singleMove = moves[j].move;
                singleValue = -10;
                break lowestLoop;
            } else if (moves[j].value == 0) {
                singleMove = moves[j].move;
                singleValue = 0;
                break lowestLoop;
            } else {
                singleMove = moves[j].move;
                singleValue = 10;
            }
        }
        return {singleValue, singleMove}
    }
    
    //console.log(copyBoard);
    // return {currentPlayer, board, actions, util, move};
    return {bestMove};

}

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
    
    const resetBoard = () => {
        for (let i = 0; i < 9; i++) {
            squares[i].mark = "";
        }
    }
    startAIButton()

    return {squares, current, resetBoard};
})();


function playerAction (coord) {
    // Function accepts coordinate in "00"-"22" format.

    // Is the game already finished?
    if (terminal (gameBoard.current())) return null;

    // Is the proposed move legal?
    let index = gameBoard.squares.findIndex(item => item.coord === coord);
    if (gameBoard.squares[index].mark != "") return null;

    // Whose turn is it?
    let mark = playerToMove(gameBoard.current())

    // Apply move to array and screen.
    gameBoard.squares[index].mark = mark;
    gameBoard.squares[index].div.innerHTML = `<img src="static/${mark}_02.png">`

    // Proceed back to gameFlow with update.
    // Is there a winner? If so, who?
    if (winner(gameBoard.current()) === mark) {

        highlightWin(mark);
        gameFlow.changeTurn(`${mark}wins`);
        
    } else if (terminal (gameBoard.current())) {
        gameFlow.changeTurn("Draw");
    }

    // Whose turn is it now?
    else if (mark === "X") {
        gameFlow.changeTurn("playerTwoTurn");
    } else {
        gameFlow.changeTurn("playerOneTurn");}
}





// Player factory function
const player = (playerName, symbol) => {
    const mark = (coord) => {
        let index = gameBoard.squares.findIndex(item => item.coord === coord);
        gameBoard.squares[index].mark = `${symbol}`;
    };
    return {playerName, symbol, mark}
}

// Initialise players
const playerOne = player("playerOne", "X");
const playerTwo = player("playerTwo", "O");


// gameFlow module
const gameFlow = (() => {
    let turn = 1;
    const delay = 1000;
    
    // Disable opponent selection if game started
    const startCheck = () => {
        if (isGameStarted(gameBoard.current())) {
            document.querySelector(".changeOpp1").classList.add("hidden")
            document.querySelector(".changeOpp2").classList.add("hidden")
        }
    }

    const changeTurn = function (player) {
        startCheck();
        let textDisplay = document.querySelector("#textDisplay");
        if (player == "Draw") {
            this.turn = 0;
            textDisplay.textContent = "Draw";
            tryAgain();
        } else if (player === "Xwins" || player === "Owins") {
            this.turn = 0;
            let text;
            player === "Xwins" ? text = "1" : text = "2";
            textDisplay.textContent = `Player ${text} Wins!`;
            tryAgain();
        } else if (player == "playerOneTurn") {
            this.turn = 1;
            textDisplay.textContent = "Player 1's turn: X";
            if (opponent.getOpp1() === 1) {
                setTimeout(() => {AIController(1);}, delay);
            }
            else if (opponent.getOpp1() === 2) {
                setTimeout(() => {AIController(2);}, delay);
            }
        } else if (player == "playerTwoTurn") {
            this.turn = 2;
            textDisplay.textContent = "Player 2's turn: O";
            if (opponent.getOpp2() === 1) {
                setTimeout(() => {AIController(1);}, delay);
            }
            else if (opponent.getOpp2() === 2) {
                setTimeout(() => {AIController(2);}, delay);
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

const highlightWin = (X) => {
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


const isGameStarted = (board) => {
    let count = 0;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            count++
        }
    }
    if (count != 9) return true;
}

// opponent selection module
const opponent = (() => {
    let opp1 = 0;
    let opp2 = 0;
    const getOpp1 = () => opp1;
    const getOpp2 = () => opp2;
    const change1 = document.querySelector(".changeOpp1")
    const change2 = document.querySelector(".changeOpp2")
    const startButton = document.querySelector("#startAI")
    
    const display = (text, value) => {
        if (value === 1) {
            document.querySelector(`.${text}`).textContent = "Easy Computer"
            document.querySelector(`.${text}`).classList.add("easyColor");
            if (text === "opp1") {
                startButton.innerHTML = "Start AI";
            }

        } else if (value === 2) {
            document.querySelector(`.${text}`).textContent = "Hard Computer"
            document.querySelector(`.${text}`).classList.remove("easyColor");
            document.querySelector(`.${text}`).classList.add("hardColor");
            if (text === "opp1") {
                startButton.innerHTML = "Start AI";
            }
 
        } else if (value === 0) {
            document.querySelector(`.${text}`).textContent = "Human"
            document.querySelector(`.${text}`).classList.remove("hardColor");
            if (text == "opp1") {
                startButton.innerHTML = "";
                textDisplay.textContent = "Player 1's turn: X";
            }
        }
    }

    function nextOpp(n) {
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

function tryAgain() {
    document.querySelector(".changeOpp1").classList.remove("hidden")
    document.querySelector(".changeOpp2").classList.remove("hidden")
    const button = document.querySelector("#tryAgain")
    button.innerHTML = "Play Again?";
    button.addEventListener("click", () => {
        resetGame();
        gameFlow.changeTurn("playerOneTurn");
    })
}
            
let resetCount = 0;
function resetGame() {
    
    if (resetCount === 2) {
        location.reload();
    }
    gameBoard.resetBoard();
    document.querySelector("#textDisplay").textContent = "Player 1's turn: X";
    for (let i = 0; i < 9; i++) {
        gameBoard.squares[i].div.innerHTML = `<img src="">`
        gameBoard.squares[i].div.classList.remove(`actionAI1`)
        gameBoard.squares[i].div.classList.remove(`actionAI2`)
        gameBoard.squares[i].div.classList.remove(`highlightX`)
        gameBoard.squares[i].div.classList.remove(`highlightO`)
        gameBoard.squares[i].div.classList.remove("fade");
    }
    gameFlow.changeTurn("playerOne");
    document.querySelector("#tryAgain").innerHTML = "";
    document.querySelector("#startAI").innerHTML = "";
    document.querySelector(".changeOpp2").classList.remove("hidden")
    resetCount++;
}

function startAIButton() {
    //debugger;
    const button = document.querySelector("#startAI")
    //button.innerHTML = "Start AI"
    button.addEventListener("click", () => {
        button.innerHTML = "";
        gameFlow.changeTurn("playerOneTurn");
    })
}

function AIController (AILevel) {
    const coords = ["00", "01", "02", "10", "11", "12", "20", "21", "22"]
    let move;
    if (terminal(gameBoard.current())) {
        return;
    }
    if (AILevel === 1) {
        let moveObj = easyAI(gameBoard.current());
        console.log("Easy", moveObj)
        if (moveObj) {
            move = moveObj[1];
        } else return;
            playerAction(coords[move]);
            highlightSquare(move, 1);

    } else if (AILevel === 2) {
        
        let moveObj = minimax(gameBoard.current()).bestMove.move
        console.log("Hard", moveObj)
        if (moveObj) {
            move = moveObj[1];
        } else return;

    playerAction(coords[move]);
    highlightSquare(move, 2);
    }
}

function highlightSquare (move, opp) {
    const grid = ["s00", "s01", "s02", "s10", "s11", "s12", "s20", "s21", "s22"]
    let highlight = grid[move];
    let square = document.querySelector(`.${highlight}`);
    square.classList.add(`actionAI${opp}`);
    setTimeout(function () {
        square.classList.add("fade");
    }, 10);
    setTimeout(function () {
        square.classList.remove(`actionAI${opp}`);
        square.classList.remove("fade");
    }, 1200);
}



// Easy AI 
const easyAI = (board) => {
        const legalMoves = actionsList(board);
        let move = legalMoves[Math.floor(Math.random() * legalMoves.length)]
        return move;
}

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
    
    // Checks whose move. Sets varable to X or O.
    const currentPlayer = playerToMove(board);
    let bestMove;

    if (currentPlayer == "X") {
        bestMove = maxValue(board);
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
            let check = maxValue(result(state, legalMoves[i])).value
            if (check < v) {
                v = check;
                move = legalMoves[i];
            }
        }
        return {value: v, move: move}
    }
    return {bestMove};
}

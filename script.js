// gameBoard module
const gameBoard = (() => {
    const squares = []
        for (let i = 0; i < 3; i ++) {
            for (let j = 0; j < 3; j++) {
                let div = document.querySelector(`.s${i}${j}`);
                div.addEventListener("click", function () {
                    console.log(`Square ${i}${j} clicked`)
                });
                let square = {coord: `${i}${j}`, mark: "", div: div};
                squares.push(square);
            }
        }
    
    return {squares};
})();

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
            console.log("Player 2's turn");
            this.turn = 2;
            textDisplay.textContent = "Player 2's turn: O";
        } else {
            this.turn = 0;
        }
    }

    return {turn, changeTurn};
})();
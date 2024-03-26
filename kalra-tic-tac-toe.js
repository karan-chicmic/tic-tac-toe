"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
//AI: O
// Human: 1
var prompt = require("prompt");
var SinglePlayer = 0;
var boardSize = 0;
var Board;
var allWinnings;
function initializeBoard() {
    Board = [];
    for (var i = 0; i < boardSize; i++) {
        var boardRow = [];
        for (var j = 0; j < boardSize; j++) {
            boardRow.push(" ");
        }
        Board.push(boardRow);
    }
    printBoard();
}
function printBoard() {
    for (var i = 0; i < boardSize; i++) {
        var boardRow = "| ";
        for (var j = 0; j < boardSize; j++) {
            boardRow += Board[i][j] + " | ";
        }
        console.log(boardRow);
    }
}
function generateAllPossibleWinnings() {
    allWinnings = [];
    for (var i = 0; i < boardSize; i++) {
        var rowWinnings = [];
        var colWinnings = [];
        for (var j = 0; j < boardSize; j++) {
            rowWinnings.push([i, j]);
            colWinnings.push([j, i]);
        }
        allWinnings.push(rowWinnings);
        allWinnings.push(colWinnings);
    }
    var diaWinnings1 = [];
    var diaWinnings2 = [];
    for (var i = 0; i < boardSize; i++) {
        diaWinnings1.push([i, i]);
        diaWinnings2.push([i, boardSize - 1 - i]);
    }
    allWinnings.push(diaWinnings1);
    allWinnings.push(diaWinnings2);
}
function checkWin(player) {
    var sz = allWinnings.length;
    for (var i = 0; i < sz; i++) {
        var ct = 0;
        for (var j = 0; j < allWinnings[i].length; j++) {
            var _a = allWinnings[i][j], x = _a[0], y = _a[1];
            // console.log(x,y) ;
            if (Board[x][y] == player)
                ct++;
        }
        if (ct == boardSize)
            return true;
    }
    return false;
}
function AiTurn(alpha, beta) {
    var bestScore = -Infinity;
    var move;
    // Iterate through all empty cells
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (Board[i][j] === " ") {
                // Make the move
                Board[i][j] = "O";
                // Calculate the score for this move
                var score = minimax(Board, 0, alpha, beta, false);
                Board[i][j] = " ";
                // If the score is better than the current best score, update bestScore and move
                if (score > bestScore) {
                    bestScore = score;
                    move = { i: i, j: j };
                }
            }
        }
    }
    // Make the best move
    Board[move.i][move.j] = "O";
}
function minimax(board, depth, alpha, beta, isMaximizing) {
    // Check if the game is over or if it's a terminal state
    if (checkWin("X")) {
        return -1;
    }
    else if (checkWin("O")) {
        return 1;
    }
    else if (isBoardFull()) {
        return 0;
    }
    // Maximizing player's turn
    if (isMaximizing) {
        var bestScore = -Infinity;
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = "O"; // Make the move
                    var score = minimax(board, depth - 1, alpha, beta, false);
                    board[i][j] = " "; // Undo the move
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
    else {
        // Minimizing player's turn
        var bestScore = Infinity;
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                if (board[i][j] === " ") {
                    board[i][j] = "X"; // Make the move
                    var score = minimax(board, depth - 1, alpha, beta, true);
                    board[i][j] = " "; // Undo the move
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
}
function isBoardFull() {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (Board[i][j] === " ") {
                return false; // Found an empty cell, board is not full
            }
        }
    }
    return true; // Board is full
}
function validPosition(i, j) {
    return i >= 0 && j >= 0 && i < boardSize && j < boardSize;
}
function playerTurn(player, alpha, beta) {
    if (isBoardFull()) {
        console.log("Match draw ");
        return;
    }
    if (SinglePlayer === 1 && player === "O") {
        console.log("Player  ".concat(player, " Turn "));
        AiTurn(alpha, beta);
        printBoard();
        if (checkWin(player)) {
            console.log(" ".concat(player, " won the game "));
            return;
        }
        if (isBoardFull() || checkWin("X")) {
            return;
        }
        playerTurn("X", alpha, beta);
    }
    else {
        console.log("Player  ".concat(player, " Turn  :  Enter position in i,j format  "));
        prompt.get(["position"], function (err, result) {
            if (result && result.position) {
                var _a = result.position.split(",").map(function (num) {
                    return parseInt(num);
                }), i = _a[0], j = _a[1];
                if (validPosition(i, j)) {
                    // if (Board[i][j] !== 'X' && Board[i][j] !== 'O')
                    if (Board[i][j] === " ") {
                        Board[i][j] = player;
                        printBoard();
                        if (checkWin(player)) {
                            console.log(" ".concat(player, " won the game "));
                            return;
                        }
                        if (player === "X")
                            playerTurn("O", alpha, beta);
                        else
                            playerTurn("X", alpha, beta);
                    }
                    else {
                        console.log(" This position is already filled enter another position ");
                        playerTurn(player, alpha, beta);
                    }
                }
                else {
                    console.log("Please enter the valid position  !");
                    playerTurn(player, alpha, beta);
                }
            }
            else {
                console.log(" Please Enter the numbers in  row, col format ");
                playerTurn(player, alpha, beta);
            }
        });
    }
}
function startPlaying(alpha, beta) {
    console.log("Enter the size of the board");
    prompt.get(["size"], function (err, result) {
        var size = parseInt(result.size);
        if (size > 2) {
            boardSize = size;
            console.log(boardSize);
            initializeBoard();
            generateAllPossibleWinnings();
            playerTurn("X", alpha, beta);
        }
        else {
            console.log("Please enter the size in numbers greater than or equal to 3");
            startPlaying(alpha, beta);
        }
    });
}
function chooseGameMode() {
    console.log("Start the game by selecting the game mode ");
    console.log("1  :  For the Single Player Mode ");
    console.log("2  :  For the Multi Player Mode ");
    prompt.get(["mode"], function (err, result) {
        var mode = parseInt(result.mode);
        if (mode === 1) {
            console.log("Single Player mode selected.");
            startPlaying(-Infinity, Infinity);
            SinglePlayer = 1;
        }
        else if (mode === 2) {
            console.log("Multi Player mode selected.");
            startPlaying(-Infinity, Infinity);
        }
        else {
            console.log("Invalid choice. Please enter 1 for Single Player or 2 for Multiplayer.");
            chooseGameMode();
        }
    });
}
chooseGameMode();

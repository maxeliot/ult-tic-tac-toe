import { Player } from "./player.js";

//returns false if a move is valid, true if it isn't
function illegalMove(subgrid, i, j) {
    let cellOccupied = subgrid.grid[i * 3 + j] != Player.None;
    let gridAlreadyWon = subgrid.won != Player.None;
    return cellOccupied || gridAlreadyWon;
}




const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
];

function subgridWinner(subgrid) {
    let winner = Player.None;
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (subgrid[a] != Player.None && subgrid[a] === subgrid[b] && subgrid[a] === subgrid[c]) {
            winner = subgrid[a];
            return winner;
        }
	}

    if (!subgrid.includes(Player.None)) {
        winner = Player.Tie;
        return winner;
    }

    return winner;
}

function maingridWinner(subgrids) {
    let winner = Player.None;
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (subgrids[a].won === subgrids[b].won && subgrids[a].won === subgrids[c].won) {
            winner = subgrids[a].won;
            return winner;
        }
    }
    
    if (!subgrids.map(subgrid => subgrid.won).includes(Player.None)) {
        winner = Player.Tie
        return winner;
    }

    return winner;
}

export { subgridWinner, maingridWinner, illegalMove };
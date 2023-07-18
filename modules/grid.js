import { Player } from "./player.js";
import { clearText, cantPlay, playerWon, showPlayerTurn } from "./user-help.js";

let currPlayer = Player.X;

/* 
GRID IS ENCODED AS 1-D ARRAY
0 1 2 
3 4 5 
6 7 8
*/
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

class SubGrid {
	constructor() {
		this.won = Player.None;
		//empty grid
		this.grid = Array(9).fill(Player.None);
	}

	//returns true if can play move, false otherwise
	play(i, j) {
		if(this.won != Player.None || this.grid[i * 3 + j] != Player.None) {
			return false;
		}

		this.grid[i * 3 + j] = currPlayer;
		this.updateWon();
		return true;
	}

	updateWon() {
		
		for (let combination of winningCombinations) {
			const [a, b, c] = combination;
			if (this.grid[a] != Player.None && this.grid[a] === this.grid[b] && this.grid[a] === this.grid[c]) {
                this.won = this.grid[a];
                return;
			}
		}

		if (!this.grid.includes(Player.None)) {
			this.won = Player.Tie;
			return;
		}
		
	}
}

class MainGrid {
	constructor() {
		this.won = Player.None;
		this.subgrids = Array(9).fill().map(() => new SubGrid());
		this.anyGrid = -1; 
		this.nextGrid = this.anyGrid;
		this.lastMove = "0000";
	}

	//returns true if can play move, false otherwise
	//(x,y) are the coordinates of main grid
	//(i,j) are the coordinates inside subgrid
	play(x, y, i, j) {
		clearText();
		let gridNbr = x * 3 + y;
		if(this.won != Player.None //if game is already over
			|| (gridNbr != this.nextGrid && this.nextGrid != this.anyGrid)) //or we didn't play in correct subgrid
		{
			return false;
		}
		
		//try to play in subgrid, if can't return false (dont'play)
		if(!this.subgrids[gridNbr].play(i, j)) 
			return false; 
		
		//Move is playable
		//unhighlight current grid
		// document.getElementById(`subgrid${gridNbr}`).classList.remove("highlight-subgrid");
		// console.log(document.getElementsByClassName("cell_l1").array);
		document.querySelectorAll(".cell_l1").forEach(element => {
			element.classList.remove("highlight-subgrid");
		}); 
		//unhighlight played cell
		document.getElementById(this.lastMove).classList.remove("highlight-cell");

		//next grid is determined by cell of subgrid we played in
		this.nextGrid = i*3+j;
		//if next player is sent to an already completed grid (won or tie), they can play anywhere
		if(this.subgrids[this.nextGrid].won != Player.None) {
			this.nextGrid = this.anyGrid;
		} 
		//highlight nextGrid
		if(this.nextGrid != this.anyGrid) {
			document.getElementById(`subgrid${this.nextGrid}`).classList.add("highlight-subgrid");
		} else {	
			//highlight all subgrids that are still playable
			this.subgrids.map((subgrid, index) => [subgrid, index])
						 .filter(el => el[0].won == Player.None)
						 .map(el => `subgrid${el[1]}`)
						 .forEach(str => document.getElementById(str).classList.add("highlight-subgrid"));
		}
		this.updateWon();

		
		//highlight played cell
		this.lastMove = [x, y ,i, j].join("");
		document.getElementById(this.lastMove).classList.add("highlight-cell");
		return true;
	}

	updateWon() {
		for (let combination of winningCombinations) {
			const [a, b, c] = combination;
			if (this.subgrids[a].won === this.subgrids[b].won && this.subgrids[a].won === this.subgrids[c].won) {
			  this.won = this.subgrids[a].won;
			  playerWon(this.won);
			  return;
			}
		}
		if (!this.subgrids.map(subgrid => subgrid.won).includes(Player.None)) {
			this.won = Player.Tie
			playerWon(this.won);
			return
		}
	}
}

let grid = new MainGrid();


/*
Create the grid in which the game will be played.
*/
function createGrid(el) {

	let x = 0;
	let y = 0;
    for (x = 0; x < 3; x++) {
        const row = document.createElement('div');
        row.className = "row_l1";
        for (y = 0; y < 3; y++) {
            const cell = document.createElement('div');
            cell.className = "cell_l1";

			//make each subgrid have an independant id, useful for styling (e.g. highlighting next grid)
			cell.id = `subgrid${x*3 + y}`
            makeInnerGrid(cell)
            row.appendChild(cell);
        }                
        el.appendChild(row);
    }

	function makeInnerGrid(el) {
		for (let i = 0; i < 3; i++) {
			const row = document.createElement('div');
			row.className = "row_l2";
			for (let j = 0; j < 3; j++) {
				const cell = document.createElement('div');
				cell.className = "cell_l2";
				cell.id = [x, y ,i, j].join("");
				//clicking a cell will call function with cell coordinates.
				cell.setAttribute("onclick", `makeMove(${x},${y},${i},${j})`); 
				cell.innerHTML = Player.None;
				row.appendChild(cell);
			}                
			el.appendChild(row);
		}
	}
}


//checks if move is valid and then play move
function makeMove(x, y, i, j) {
	if(grid.play(x, y, i, j) === false) {
		cantPlay();
		return;
	}
	let id = [x, y ,i, j].join("");
	let cell = document.getElementById(id);
	cell.innerHTML = currPlayer;
	
	if(currPlayer == Player.X) currPlayer = Player.O;
	else currPlayer = Player.X;
	
	//if game is still in play, display next player turn
	if(grid.won == Player.None) {
		showPlayerTurn(currPlayer);
	}
	return;
}



export { createGrid, makeMove };


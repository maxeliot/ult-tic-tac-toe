import { Player } from "./player.js";
import { showCantPlay, showPlayerWon, 
	showPlayerTurn, unhighlightPrev, highlightDisplayMove } from "./user-help.js";
import { subgridWinner, maingridWinner, subgridIllegalMove,
	 maingridIllegalMove } from "./rules.js";

let currPlayer = Player.X;

/* 
GRID IS ENCODED AS 1-D ARRAY
0 1 2 
3 4 5 
6 7 8
*/
class SubGrid {
	constructor() {
		this.won = Player.None;
		//init with empty grid
		this.grid = Array(9).fill(Player.None);
	}

	//returns true if can play move, false otherwise
	play(i, j) {

		if(subgridIllegalMove(this, i, j)) {
			return false;
		}

		this.grid[i * 3 + j] = currPlayer;
		
		this.won = subgridWinner(this.grid);
		return true;
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
		let gridNbr = x*3 + y;

		if(maingridIllegalMove(this, gridNbr)) {
			return false;
		}
		
		//try to play in subgrid, if can't return false (dont'play)
		if(!this.subgrids[gridNbr].play(i, j)) 
			return false; 

		//next grid is determined by cell of subgrid we played in
		this.nextGrid = i*3 + j;
		//if next player is sent to an already completed grid (won or tie), they can play anywhere
		if(this.subgrids[this.nextGrid].won != Player.None) {
			this.nextGrid = this.anyGrid;
		} 
		
		this.won = maingridWinner(this.subgrids);
		return true;
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

			//text area to cross out entire subgrid with X or O
			let div = document.createElement('div');
			div.className = "cross-out";
			div.textContent="";
			cell.appendChild(div)

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
				cell.onclick = makeMove(x,y,i,j);

				cell.innerHTML = Player.None;
				row.appendChild(cell);
			}                
			el.appendChild(row);
		}
	}
	
}


//Checks if move is valid and then plays move
//highlights played cell
function makeMove(x, y, i, j) {
	return function() {

		if (grid.play(x, y, i, j) === false) {
			showCantPlay();
			return;
		}
		
		unhighlightPrev(grid);
		highlightDisplayMove(grid, x, y, i, j, currPlayer);
		
		/* TODO 
		I would like to do this inside of the MainGrid.play function,
		but since we need to unhighlight lastMove we need to do it after?
		*/
		let id = [x, y, i, j].join("");
		grid.lastMove = id;
		

		//player switch
		currPlayer = (currPlayer == Player.X) ? Player.O : Player.X;
	
		//next player turn or end of game
		if (grid.won == Player.None) {
			showPlayerTurn(currPlayer);
		} else {
			showPlayerWon(grid.won);
			//make cells non clickable
			document.querySelectorAll(".cell_l2").forEach(el => el.onclick = '');
			unhighlightPrev(grid);
		}
	};
}


export { createGrid, makeMove, SubGrid };


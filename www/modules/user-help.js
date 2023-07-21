import { Player } from "./player.js";

let text = document.getElementById("user-help");

function showPlayerTurn(player) {
    text.textContent = `Player ${player}'s turn`
}

function clearText() {
    text.textContent = "";
}

function showCantPlay() {
    text.textContent = "You can't play here !";
}

function showPlayerWon(player) {
    if(player != Player.None) {
        text.textContent = `Player ${player} won the game!`;
    }
}

function unhighlightPrev(grid) {
    //unhighlight played cell
	document.getElementById(grid.lastMove).classList.remove("highlight-cell");

    //unhighlight all subgrids
    document.querySelectorAll(".cell_l1").forEach(element => {
        element.classList.remove("highlight-subgrid");
    });
}

function highlightDisplayMove(grid, x, y, i, j, currPlayer) {
    //highlight played cell and write X or O
    let id = [x, y, i, j].join("");
    let cell = document.getElementById(id);
    cell.innerHTML = currPlayer;
    cell.classList.add("highlight-cell");

    //highlight nextGrid
    if(grid.nextGrid != grid.anyGrid) {
        document.getElementById(`subgrid${grid.nextGrid}`).classList.add("highlight-subgrid");
    } else {	
        //highlight all subgrids that are still playable
        grid.subgrids.map((subgrid, index) => [subgrid, index])
                        .filter(el => el[0].won == Player.None)
                        .map(el => `subgrid${el[1]}`)
                        .forEach(str => document.getElementById(str).classList.add("highlight-subgrid"));
    }

    //cross out subgrid if it is won
    let gridNbr = x*3 + y;

    if(grid.subgrids[gridNbr].won != Player.None) {
        let el = document.getElementById(`subgrid${gridNbr}`)
        el.querySelectorAll(".row_l2").forEach(el => el.style.display = 'none');
        el.querySelector(".cross-out").display = 'block';
        el.querySelector(".cross-out").textContent = grid.subgrids[gridNbr].won;
        el.querySelector(".cross-out").style.width = "100%";
        el.querySelector(".cross-out").style.height = "100%";
    }
}

export { showCantPlay, clearText, showPlayerWon, showPlayerTurn, unhighlightPrev, highlightDisplayMove };
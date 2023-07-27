//ideally would like to have a game.js module that does all the interacting.
//haven't figured out how to do that

import { createGrid, makeMove } from "./modules/grid.js";


createGrid(document.getElementById('grid'));

document.querySelectorAll(".cell_l1").forEach(element => {
	element.classList.add("highlight-subgrid");
});

function reset() {
	location.reload();
}

//SOCKETIO SETUP
var socket = io();
socket.on('full', () => {
    alert("Game is full");
    location.reload();
});

//why do i need to do this..
window.makeMove = makeMove;
window.reset = reset;




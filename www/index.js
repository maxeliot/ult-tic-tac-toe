//ideally would like to have a game.js module that does all the interacting.
//haven't figured out how to do that

import { createGrid, makeMove, yourTurn, } from "./modules/grid.js";


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
socket.on('waiting for player', () => {
    //WE ARE X
    yourTurn(); //TODO CHANGE
    console.log("waiting for player");
});

socket.on('matched with player', () => {
    //WE ARE O
    console.log("matched with player");
});

socket.on('start', () => {
    console.log("start");
});

socket.on('move', move => {
    makeMove(parseInt(move[0]), parseInt(move[1]), parseInt(move[2]), parseInt(move[3]), true)();
    yourTurn();
    
});

function getSocket() {
    return socket;
}

//why do i need to do this..
window.makeMove = makeMove;
window.reset = reset;


export { getSocket };
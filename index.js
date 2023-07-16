//ideally would like to have a game.js module that does all the interacting.
//haven't figured out how to do that

import { createGrid, makeMove, reset } from "./modules/grid.js";


createGrid(document.getElementById('grid'));	


//why do i need to do this..
window.makeMove = makeMove;
window.reset = reset;




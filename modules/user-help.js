import { Player } from "./player.js";

let text = document.getElementById("user-help");


function clearText() {
    text.textContent = "";
}

function cantPlay() {
    text.textContent = "";
    text.textContent = "You can't play here !";
}

function playerWon(player) {
    if(player != Player.None) {
        text.textContent = `Player ${player} won the game!` 
    }
}

export { cantPlay, clearText, playerWon };
import { SubGrid } from "../modules/grid.js";
import { Player } from "../modules/player.js";
import { subgridWinner } from "../modules/rules";

test("correctly determine subgrid winner", () => {
    let subgrid1 = new SubGrid();
    subgrid1.grid = 
       [Player.None, Player.None, Player.None, 
        Player.None, Player.None, Player.None, 
        Player.None, Player.None, Player.None ];
    
    expect(subgridWinner(subgrid1.grid)).toBe(Player.None)

    let subgrid2 = new SubGrid();
    subgrid2.grid = 
       [Player.X, Player.None, Player.None, 
        Player.X, Player.X,    Player.None, 
        Player.O, Player.O,    Player.X ];
    
    expect(subgridWinner(subgrid2.grid)).toBe(Player.X)

    let subgrid3 = new SubGrid();
    subgrid3.grid = 
       [Player.O,    Player.O,    Player.O, 
        Player.None, Player.None, Player.None, 
        Player.None, Player.None, Player.None ];
    
    expect(subgridWinner(subgrid3.grid)).toBe(Player.O)

    let subgrid4 = new SubGrid();
    subgrid4.grid = 
       [Player.X, Player.X, Player.O, 
        Player.O, Player.O, Player.X, 
        Player.X, Player.O, Player.X ];
    
    expect(subgridWinner(subgrid4.grid)).toBe(Player.Tie)
});
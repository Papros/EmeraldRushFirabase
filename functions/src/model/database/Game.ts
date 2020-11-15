import { Mine, MINE_STATE } from "./Mine";
import { PlayerInQueue } from "./PlayerInQueue";
import { PlayerPrivate } from "./PlayerPrivate";
import { PlayerPublic } from "./PlayerPublic";

export enum GAME_STATE {
    WAITING_FOR_MOVE, WAITING_FOR_CARD, FINISHED
}

export class Game {

    GameUID: string;
    PlayersPublic: PlayerPublic[]; // Public data of player
    PlayersPrivate: PlayerPrivate[]; // Private data of player
    PlayersActive: String[];
    MineNumber: number;
    Mines: Mine[];
    GameState: number;
    CurrentMineID: number;
    RemovedCards: number[];
    GameStartTimestamp: number;

    constructor (uid:string, players: PlayerInQueue[]){
        this.GameUID = uid; 
        this.PlayersPublic = [];
        this.PlayersPrivate = [];
        this.GameState = GAME_STATE.WAITING_FOR_MOVE;
        this.MineNumber = 3;
        this.Mines = [];
        this.CurrentMineID = 0;
        this.PlayersActive = [];
        this.RemovedCards = [];
        this.GameStartTimestamp = Date.now();

        for(let n = 0; n < this.MineNumber; n++){
            this.Mines.push(new Mine());
        }

        this.Mines[0].MineState = MINE_STATE.CURRENT;

        players.forEach( (player,index) => {
            this.PlayersActive.push( player.UserUID );
            this.PlayersPublic.push( new PlayerPublic(index,"Player_"+index,player.UserUID));
            this.PlayersPrivate.push( new PlayerPrivate(index, player.UserUID));
            console.log("add new player");
        });

        console.log("players list lenght: "+this.PlayersPrivate.length);
        
    }

}
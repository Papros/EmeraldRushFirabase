import { Mine } from "../game/Mine";
import { PlayerInQueue } from "./PlayerInQueue";
import { PlayerPrivate } from "./PlayerPrivate";
import { PlayerPublic } from "./PlayerPublic";

export enum GAME_STATE {
    WAITING_FOR_MOVE, WAITING_FOR_CARD, CALCULATING, STARTING
}

export class Game {

    GameUID: string;
    Players_Public: PlayerPublic[]; // Public data of player
    Players_Private: PlayerPrivate[]; // Private data of player
    MineNumber: Number;
    Mines: Mine[];
    GameState: GAME_STATE;

    constructor (uid:string, players: PlayerInQueue[]){
        this.GameUID = uid; 
        this.Players_Public = [];
        this.Players_Private = [];
        this.GameState = GAME_STATE.STARTING;
        this.MineNumber = 3;
        this.Mines = [];

        for(let n = 0; n < this.MineNumber; n++){
            this.Mines.push(new Mine());
        }

        players.forEach( (player,index) => {
            this.Players_Public.push( new PlayerPublic(index,player.UserUID));
            this.Players_Private.push( new PlayerPrivate(index, player.UserUID));
            console.log("add new player");
        });

        console.log("players list lenght: "+this.Players_Private.length);
        
    }

}
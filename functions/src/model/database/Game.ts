import { Mine } from "../game/Mine";
import { PlayerInQueue } from "./PlayerInQueue";
import { PlayerPrivate } from "./PlayerPrivate";
import { PlayerPublic } from "./PlayerPublic";

export class Game {

    GameUID: string;
    Players_Public: PlayerPublic[]; // Public data of player
    Players_Private: PlayerPrivate[]; // Private data of player
    Mines: Mine[];

    constructor (uid:string, players: PlayerInQueue[]){
        this.GameUID = uid; 
        this.Players_Public = [];
        this.Players_Private = [];

        players.forEach( (player,index) => {
            this.Players_Public.push( new PlayerPublic(index,player.UserUID));
            this.Players_Private.push( new PlayerPrivate(index, player.UserUID));
            console.log("add new player");
        });

        console.log("players list lenght: "+this.Players_Private.length);
        
        this.Mines = [];
    }


}
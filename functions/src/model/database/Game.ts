import { Mine, MINE_STATE } from "./Mine";
import { PlayerInQueue } from "./PlayerInQueue";
import { PlayerPrivate } from "./PlayerPrivate";
import { PlayerPublic } from "./PlayerPublic";

export enum GAME_STATE {
    WAITING_FOR_MOVE, WAITING_FOR_CARD, FINISHED, WAITING_FOR_FIRST
}

export class Game {

    Public:{
        data:{
            GameUID: string;
            DecisionTime: number;
            PlayersPublic: PlayerPublic[];
            MineNumber: number;
            Mines: Mine[];
            CurrentMineID: number;
            GameStartTimestamp: number;
        }
    };

    Private:{
        PlayersPrivate: PlayerPrivate[]
    };

    Secret:{
        PlayersActive: String[];
        GameState: number;
        RemovedCards: number[];
        DecisionDeadline: number;
        DecisionTolerance: number;
    }

    constructor (uid:string, players: PlayerInQueue[]){

        this.Public = {
            data:{
                GameUID: uid,
                PlayersPublic: [],
                MineNumber: 3,
                DecisionTime: 30,
                Mines: [],
                CurrentMineID: 0,
                GameStartTimestamp: Date.now()
            }
        };
        
        this.Private = {
            PlayersPrivate: []
        };

        this.Secret = {
            PlayersActive: [],
            GameState: GAME_STATE.WAITING_FOR_FIRST,
            DecisionDeadline: 0,
            RemovedCards: [],
            DecisionTolerance: 3,
        }

        for(let n = 0; n < this.Public.data.MineNumber; n++){
            this.Public.data.Mines.push(new Mine());
        }

        this.Public.data.Mines[0].MineState = MINE_STATE.CURRENT;

        players.forEach( (player,index) => {
            this.Secret.PlayersActive.push( player.UserUID );
            this.Public.data.PlayersPublic.push( new PlayerPublic(index,"Player_"+index,player.UserUID));
            this.Private.PlayersPrivate.push( new PlayerPrivate(index, player.UserUID));
            console.log("add new player");
        });

        console.log("players list lenght: "+this.Private.PlayersPrivate.length);
        
    }

}
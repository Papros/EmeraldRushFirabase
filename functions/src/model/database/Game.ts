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
            RoundID: number;
            GameUID: string;
            DecisionTime: number;
            RoundCooldownTime: number;
            PlayersPublic: PlayerPublic[];
            MineNumber: number;
            Mines: Mine[];
            CurrentMineID: number;
            GameStartTimestamp: number;
            DragonMinimalDeep: number;
            PublicState: number;
        }
    };

    Private:{
        PlayersPrivate: PlayerPrivate[]
    };

    Secret:{
        GameState: number;
        RemovedCards: number[];
        DecisionDeadline: number;
        DecisionTolerance: number;

    }

    constructor (uid:string, players: PlayerInQueue[]){

        this.Public = {
            data:{
                RoundID: 0,
                GameUID: uid,
                PlayersPublic: [],
                MineNumber: 3,
                DecisionTime: 20,
                RoundCooldownTime: 20,
                Mines: [],
                CurrentMineID: 0,
                GameStartTimestamp: Date.now(),
                DragonMinimalDeep: 5,
                PublicState: GAME_STATE.WAITING_FOR_FIRST
            }
        };
        
        this.Private = {
            PlayersPrivate: []
        };

        this.Secret = {
            GameState: GAME_STATE.WAITING_FOR_FIRST,
            DecisionDeadline: Date.now()+this.Public.data.RoundCooldownTime,
            RemovedCards: [],
            DecisionTolerance: 3,
        }

        for(let n = 0; n < this.Public.data.MineNumber; n++){
            this.Public.data.Mines.push(new Mine());
        }

        this.Public.data.Mines[0].MineState = MINE_STATE.CURRENT;

        players.forEach( (player,index) => {
            this.Public.data.PlayersPublic.push( new PlayerPublic(index,"Player_"+index,player.UserUID));
            this.Private.PlayersPrivate.push( new PlayerPrivate(index, player.UserUID));
        });

        
    }

}


import * as functions from 'firebase-functions';
import { PlayerInQueue } from '../model/database/PlayerInQueue';
import * as GameMaker from '../service/GameMaker';

export const SearchInQueue = (mode:string, snapshot : functions.database.DataSnapshot):void => {

    snapshot.ref.root.child('QUEUE').on("value", snapshot => {

        let gameList:PlayerInQueue[] = [];
        let limit:number = 0;
        
        switch(mode){
            case "GAME_2_PLAYERS": limit = 2; break; 
            case "GAME_4_PLAYERS": limit = 4; break;
            case "GAME_8_PLAYERS": limit = 8; break;
            default: limit = 0; 
        }

        let enoughPlayer:boolean = false;

        snapshot.forEach( player => {
           
            if(!enoughPlayer){
                const p: PlayerInQueue = player.val();
                if(p.GameMode === mode && p.UserUID != "Admin"){
                    gameList.push(p);
                    if(gameList.length === limit && !enoughPlayer){
                        GameMaker.MakeGame(mode,gameList);
                        enoughPlayer = true;
                    }
                }
            }
            
        });

    });
    
 };
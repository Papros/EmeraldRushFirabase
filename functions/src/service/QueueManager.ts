import * as functions from 'firebase-functions';
import { PlayerInQueue } from '../model/database/PlayerInQueue';
import * as GameMaker from './GameMaker';

export const QueueListener = functions.database.ref("/QUEUE/{userUID}").onCreate((snapshot,context) => {

    const userData = snapshot.val();
 
    const game_mode = userData.GameMode;


    functions.logger.log("Test logowania 16:10 :  ")
    functions.logger.log(" New user added to Queue: "+context.params.userUID+" to mode: "+game_mode);

    SearchInQueue(game_mode, snapshot);

 });

 const SearchInQueue = (mode:string, snapshot : functions.database.DataSnapshot):void => {

    snapshot.ref.root.child('QUEUE').on("value", snapshot => {

        let gameList:PlayerInQueue[] = [];

        let limit:number = 0;
        
        switch(mode){
            case "GAME_2_PLAYERS": limit = 2; break; 
            case "GAME_4_PLAYERS": limit = 4; break;
            case "GAME_8_PLAYERS": limit = 8; break;
            default: limit = 0; 
        }

        let flag:boolean = false;

        snapshot.forEach( player => {
           
            if(!flag){
                const p: PlayerInQueue = player.val();
                if(p.GameMode === mode && p.UserUID != "Admin"){
                    gameList.push(p);
                    if(gameList.length === limit && !flag){
                        GameMaker.MakeGame(mode,gameList);
                        flag = true;
                    }
                }
            }
            
        });

    });
    
 };
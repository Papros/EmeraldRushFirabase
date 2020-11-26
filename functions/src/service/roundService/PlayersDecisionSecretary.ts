import * as firebase from 'firebase-admin';
import { Game, GAME_STATE } from "../../model/database/Game";
import { PLAYER_DECISION } from '../../model/database/PlayerPrivate';

export const RegisterNewDecision = (GameUID:string, playerId: number) => {

    return new Promise( (resolve,reject) => {

        firebase.database().ref(`GAME_LIST/${GameUID}/game`).transaction( (GameInstance:Game) => {

            if(GameInstance == null){
                return null;
            } 
            else{

                if(GameInstance.Secret.GameState == GAME_STATE.WAITING_FOR_MOVE){
                    let playersPrivate = GameInstance.Private.PlayersPrivate;
                    let deadline = Date.now() >= GameInstance.Secret.DecisionDeadline;
                    let everyoneDecided = playersPrivate.filter( player => player.Decision != PLAYER_DECISION.UNKNOWN).length == 0;

                    if(deadline || everyoneDecided){
                        GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_CARD;
                    }

                    return GameInstance;

                }else{
                    return GameInstance;
                }
                
            }

        }, (error) => {
            if(error){
                reject();
            }
        } ).then((resoult) => {
            if(resoult.committed){
                resolve();
            }else{
                reject();
            }
        });

    });

}
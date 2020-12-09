import * as firebase from 'firebase-admin';
import { Game, GAME_STATE } from "../../model/database/Game";

export const ManagePlayerDecision = (GameUID:string) => {

    return new Promise( (resolve,reject) => {

        firebase.database().ref(`GAME_LIST/${GameUID}/game`).transaction( (GameInstance:Game) => {

            if(GameInstance == null){
                return null;
            } 
            else{

                if(GameInstance.Secret.GameState == GAME_STATE.WAITING_FOR_MOVE || GameInstance.Secret.GameState == GAME_STATE.ROUND_SUMMARY){
                    
                    let deadline = Date.now() >= GameInstance.Secret.DecisionDeadline;
                    if(deadline){
                        if(GameInstance.Secret.GameState == GAME_STATE.WAITING_FOR_MOVE){
                            GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_CARD;
                        }
                        else if(GameInstance.Secret.GameState == GAME_STATE.ROUND_SUMMARY){
                            GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_FIRST;
                        }   
                    }
                    
                    return GameInstance;

                }else{;
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

export const WaitForPlayerDecision = (GameUID: string) => {

    firebase.database().ref(`GAME_LIST/${GameUID}/game`).on('value', (snapshot) => {

        let gameInstance: Game = snapshot.val();

        let timeToWait = gameInstance.Secret.DecisionDeadline - Date.now();

        if(timeToWait > 0){
            setTimeout(() => ManagePlayerDecision(GameUID), timeToWait);
        }
        else {
            ManagePlayerDecision(GameUID);
        }

    });
    
    
}


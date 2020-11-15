import * as firebase from 'firebase-admin';
import * as uuid from 'uuid';
import { Game } from '../model/database/Game';
import { PlayerInQueue } from '../model/database/PlayerInQueue';

export const MakeGame = (mode:string, playersList:PlayerInQueue[]) => {

    console.log("Making game...");
    
    return new Promise((resolve,reject) => {
        firebase.database().ref("QUEUE").transaction( (queue) => {
            
            if(queue == null){
                return null;
            } 
            else{

                for(let iter=0; iter<playersList.length; iter++){
                    if(queue[playersList[iter].UserUID] != null && queue[playersList[iter].UserUID] != {}){
                        queue[playersList[iter].UserUID] = {};
                        console.log("Player removed or empty object");
                    }else{
                        console.log("No players available anymore, abort transaction");
                        return;
                    }
                }

                return queue;
            }

        }, 
        (error) => {
            if(error){
                reject();
            }
        }).then( (resoult) => {
            if(resoult.committed){
                const game:Game = new Game(uuid.v4(),playersList);
                firebase.database().ref('GAME_LIST').child(game.GameUID).update(game);
        
                console.log("Add new game: "+game.GameUID);

                playersList.forEach( player => {
                    firebase.database().ref("USER_LIST").child(player.UserUID).child('user').child("GameUID").set(game.GameUID);
                });
                resolve();
            }else{
                reject();
            }
        })
    });

};

export const DeleteGame = (GameUID:string) => {
    firebase.database().ref("GAME_LIST").child(GameUID).set(null);
}



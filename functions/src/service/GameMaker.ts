import * as firebase from 'firebase-admin';
import * as uuid from 'uuid';
import { Game } from '../model/database/Game';
import { PlayerInQueue } from '../model/database/PlayerInQueue';

export const MakeGame = (mode:string, playersList:PlayerInQueue[]) => {
    
    return new Promise<string>((resolve,reject) => {
        
        firebase.database().ref("QUEUE").transaction( (queue) => {
            
            if(queue == null){
                return null;
            } 
            else{

                for(let iter=0; iter<playersList.length; iter++){
                    if(queue[playersList[iter].UserUID] != null && queue[playersList[iter].UserUID] != {}){
                        queue[playersList[iter].UserUID] = {};
                    }else{
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
                firebase.database().ref('GAME_LIST').child(game.Public.data.GameUID).child('game').update(game);
    

                playersList.forEach( player => {
                    firebase.database().ref("USER_LIST").child(player.UserUID).child('user').child("GameUID").set(game.Public.data.GameUID);
                });
                resolve(game.Public.data.GameUID);
            }else{
                reject();
            }
        })
    });


};

export const DeleteGame = (GameUID:string) => {
    firebase.database().ref("GAME_LIST").child(GameUID).set(null);
}



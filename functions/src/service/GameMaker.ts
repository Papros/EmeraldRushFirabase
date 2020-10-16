import * as firebase from 'firebase-admin';

import { Game } from '../model/database/Game';
import { PlayerInQueue } from '../model/database/PlayerInQueue';

export const MakeGame = (mode:string, players:PlayerInQueue[]) => {

    
    firebase.database().ref().transaction( () => {

        //Make game
        console.log("Making game: 123");
        const game:Game = new Game("123",players);
        firebase.database().ref('GAME_LIST').child("123").update(game);
        
        //Delete players from queue
        //Add game uid to players

        players.forEach( player => {
            firebase.database().ref("QUEUE").child(player.UserUID).remove();
            firebase.database().ref("USER_LIST").child(player.UserUID).child('user').child("GameUID").set("123");
        });

        return;
    });


}

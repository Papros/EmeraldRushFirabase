import * as functions from 'firebase-functions';

export const PlayerDecisionListener = functions.database.ref("/GAME_LIST/{gameUID}/PlayersPrivate/{playerId}/Decision").onUpdate((snapshot,context) => {

    const userDeciosion = snapshot.after;
    let gameUID = context.params.gameUID
    let playerId = context.params.playerId;

    console.log(userDeciosion+" : "+gameUID+ " : "+playerId);

 });
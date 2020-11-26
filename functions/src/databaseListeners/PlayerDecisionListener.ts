import * as functions from 'firebase-functions';
import { PLAYER_DECISION } from '../model/database/PlayerPrivate';
import { CheckDecision } from '../service/RoundManager'; 

export const PlayerDecisionListener = functions.database.ref("/GAME_LIST/{gameUID}/game/PlayersPrivate/{playerId}/Decision").onUpdate((snapshot,context) => {

    const userDeciosion = snapshot.after.val();

    switch(userDeciosion){
        case PLAYER_DECISION.UNKNOWN: break;
        case PLAYER_DECISION.GO:
        case PLAYER_DECISION.BACK: CheckDecision(context.params.gameUID, context.params.playerId); break;
    }

 });
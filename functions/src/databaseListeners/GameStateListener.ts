import * as functions from 'firebase-functions';
import * as Game from '../model/database/Game';
import * as RoundManager from '../service/RoundManager';

export const GameStateListener = functions.database.ref("/GAME_LIST/{gameUID}/game/GameState").onUpdate( (snapshot,context) => {

    const currentState = snapshot.after.val();

    switch(currentState){
        case Game.GAME_STATE.WAITING_FOR_CARD: RoundManager.PlayNextCard(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_MOVE: break;
        case Game.GAME_STATE.FINISHED: RoundManager.FinishGame(context.params.gameUID); break;
    }

 });

 
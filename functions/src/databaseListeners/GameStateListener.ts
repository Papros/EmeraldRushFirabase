import * as functions from 'firebase-functions';
import * as Game from '../model/database/Game';
import * as RoundManager from '../service/RoundManager';

export const GameStateUpdateListener = functions.database.ref("/GAME_LIST/{gameUID}/game/Secret/GameState").onUpdate( (snapshot,context) => {

    const currentState = snapshot.after.val();

    switch(currentState){
        case Game.GAME_STATE.WAITING_FOR_CARD: RoundManager.PlayNextCard(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_MOVE: RoundManager.CheckDecision(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_FIRST:  RoundManager.PlayNextCard(context.params.gameUID); break;
        case Game.GAME_STATE.FINISHED: RoundManager.FinishGame(context.params.gameUID); break;
    }

 });

 export const GameStateCreateListener = functions.database.ref("/GAME_LIST/{gameUID}/game/Secret/GameState").onCreate( (snapshot,context) => {

    const currentState = snapshot.val();
    
    switch(currentState){
        case Game.GAME_STATE.WAITING_FOR_CARD: RoundManager.PlayNextCard(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_MOVE: RoundManager.CheckDecision(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_FIRST:  RoundManager.PlayNextCard(context.params.gameUID); break;
        case Game.GAME_STATE.FINISHED: RoundManager.FinishGame(context.params.gameUID); break;
    }

 });

 
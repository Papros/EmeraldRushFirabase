import * as functions from 'firebase-functions';
import * as Game from '../../model/database/Game';
import * as CardManager from '../gameService/CardManager';

export const GameStateListener = functions.database.ref("/GAME_LIST/{gameUID}/GameState").onUpdate( (snapshot,context) => {

    const currentState = snapshot.after.val();

    switch(currentState){
        case Game.GAME_STATE.STARTING: FirstMove(context.params.gameUID); break;
        case Game.GAME_STATE.CALCULATING: CalculateTurn(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_CARD: NextCard(context.params.gameUID); break;
        case Game.GAME_STATE.WAITING_FOR_MOVE: AskForMove(context.params.gameUID); break;
    }


 });

const CalculateTurn = (GameUID: string) => {
    console.log("calculating for: "+GameUID);
}

const NextCard = (GameUID: string) => {
    console.log("next card for: "+GameUID);
    CardManager.GiveNewCard(GameUID); 
    
}

const AskForMove = (GameUID: string) => {
    console.log("Ask for move players from: "+GameUID);

}

const FirstMove = (GameUID: string) => {
    console.log("Ask for move players from: "+GameUID);
    CardManager.GiveNewCard(GameUID);    
}

 
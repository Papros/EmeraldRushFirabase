import * as DeckManager from './roundService/DeckManager';
import * as GameMaker from './GameMaker';

export const PlayNextCard = (GameUID:string) => {
    DeckManager.ManageNextRound(GameUID);
}

export const FinishGame = (GameUID:string) => {
    GameMaker.DeleteGame(GameUID);
}
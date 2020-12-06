import * as DeckManager from './roundService/DeckManager';
import * as GameMaker from './GameMaker';
import * as PlayerDecisionSecretary from './roundService/PlayersDecisionSecretary'

export const PlayNextCard = (GameUID:string) => {
    DeckManager.ManageNextRound(GameUID);
}

export const FinishGame = (GameUID:string) => {
    GameMaker.DeleteGame(GameUID);
}

export const CheckDecision = (GameUID: string) => {  
    PlayerDecisionSecretary.ManagePlayerDecision(GameUID);
}
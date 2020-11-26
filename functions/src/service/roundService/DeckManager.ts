import { Deck } from "../../model/database/Deck";
import * as firebase from 'firebase-admin';
import { Game, GAME_STATE } from "../../model/database/Game";
import { Card } from "../../model/database/Card";
import { MINE_STATE } from "../../model/database/Mine";
import { PLAYER_DECISION } from "../../model/database/PlayerPrivate";
import { PlayerStatus } from "../../model/database/PlayerPublic";

import * as EmeraldsDistibutor from './EmeraldsDistributor';

export const ManageNextRound = (GameUID:String) => {

    return new Promise<GAME_STATE>( (resolve,reject) => {

        firebase.database().ref(`GAME_LIST/${GameUID}/game`).transaction( (GameInstance:Game) => {

            if(GameInstance == null){
                return null;
            } 
            else{

                let resoultGame = SelectNextCard(GameInstance);

                if(resoultGame.Secret.GameState == GAME_STATE.WAITING_FOR_FIRST){
                    resoultGame = SelectNextCard(resoultGame);
                }

                return resoultGame;
            }

        }, (error) => {
            if(error){
                reject();
            }
        } ).then((resoult) => {
            if(resoult.committed){
                resolve();
            }else{
                reject();
            }
        });

        
    });

}

const SelectNextCard = (GameInstance:Game):Game =>{

    let deck = new Deck();
    let cards = deck.Cards;

    let newDecision:string[] = [];

    // Get Id of player who are going further
    GameInstance.Private.PlayersPrivate.forEach( player => {
        if( (player.Decision == PLAYER_DECISION.GO && GameInstance.Secret.PlayersActive.includes(player.Uid)) || GameInstance.Secret.GameState == GAME_STATE.WAITING_FOR_FIRST){
            newDecision.push(player.Uid);
        }
    });

    // When no player decide to GO further , split non-split emeralds from prevoius round
    if(newDecision.length == 0){

        let divideResoult = EmeraldsDistibutor.DivideAmongTheWinner(0, GameInstance.Secret.PlayersActive.length, GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake);

        GameInstance.Public.data.PlayersPublic.forEach( player => {
            if( GameInstance.Secret.PlayersActive.includes(player.uid) ){
                player.chest += player.pocket + divideResoult.byPlayer;
                player.pocket = 0;
            }
        });

        // Move emerald from pocket to the chest
        GameInstance.Public.data.PlayersPublic.forEach( player => {
            newDecision.push(player.uid);
        });

        // Set pointer on next mine
        GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.VISITED;
        GameInstance.Public.data.CurrentMineID++;

        // Check if next mine exist
        if(GameInstance.Public.data.MineNumber > GameInstance.Public.data.CurrentMineID){
            GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.CURRENT;
            GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_FIRST;
        }else{
            GameInstance.Secret.GameState = GAME_STATE.FINISHED;
        }

        GameInstance.Private.PlayersPrivate.forEach( player => {
            player.Decision = PLAYER_DECISION.GO;
            player.IsExploring = true;
        })

        GameInstance.Secret.PlayersActive = newDecision;
        return GameInstance;

    }else{ 

        //Filter which player are not going further
        let returningPlayerNumber = GameInstance.Private.PlayersPrivate.filter( player => {
            return GameInstance.Secret.PlayersActive.includes(player.Uid) && !newDecision.includes(player.Uid);
        }).length;

        // Moving emerlds from pocket to the chest, setting flag to false
        GameInstance.Public.data.PlayersPublic.forEach( player => {
            if(!newDecision.includes(player.uid)){
                player.chest += player.pocket;
                player.pocket = 0;
                player.status = PlayerStatus.RESTING;
                if(returningPlayerNumber == 1){
                    player.chest += GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake;
                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake = 0;
                }
            }
        });

        // Setting public flag  IsExploring on false for this player
        GameInstance.Private.PlayersPrivate.forEach( player => {
            if(!newDecision.includes(player.Uid)){
                player.IsExploring = false;
            }
        });

    }

    //In case some brave adventurer will be found, reset values (need for first round)
    if(GameInstance.Secret.RemovedCards == null){
        GameInstance.Secret.RemovedCards = [];
    }

    if(GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node == null){
        GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node = [];
    }

    //Filter cards
    cards = cards.filter((card:Card) => ( !GameInstance.Secret.RemovedCards.includes(card.CardID) &&  !GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node.includes(card.CardID)) );
    cards = ShuffleDeck(cards);
    let selectedCard:Card = cards[0];
    console.log("card filtered and shufled, first: "+selectedCard.CardID);

    if(GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node.length == 0 && deck.IsDragon(selectedCard.CardID)){
        selectedCard = cards[1];
    }
    
    // Add selected cards (first one after shuffle)
    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node.push(selectedCard.CardID);

    //Chack what card was selected
    if(deck.IsTrap(selectedCard.CardID)){

        // Check if orund was finished
        let endOfTurnResoult = CheckIfRoundIsFinnished(deck,GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node);

        //If it`s 3rd trap or dragon
        if(endOfTurnResoult.resoult || deck.IsDragon(selectedCard.CardID)){

            GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.VISITED;
            GameInstance.Public.data.CurrentMineID++;

            if(GameInstance.Public.data.MineNumber > GameInstance.Public.data.CurrentMineID){ // Check if there is more not-visited mines

                GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.CURRENT; 

                if(endOfTurnResoult.resoult){
                    GameInstance.Secret.RemovedCards = GameInstance.Secret.RemovedCards.concat(endOfTurnResoult.cardsToRemove); // Add 3 trap ID's
                }else{
                    GameInstance.Secret.RemovedCards.push(selectedCard.CardID); // Add dragon's card id
                }

                // Set "dead" status, only use in resoult display
                GameInstance.Private.PlayersPrivate.forEach( player => {
                        player.IsExploring = true;
                });

                // Reset players pocket, and bring public flag
                GameInstance.Public.data.PlayersPublic.forEach( player => {
                    if(newDecision.includes(player.uid)){
                        player.status = PlayerStatus.DEAD;
                        player.pocket = 0;
                    }
                });

                GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_FIRST;

            }else{
                GameInstance.Secret.GameState = GAME_STATE.FINISHED;
            }

        }else{ 
            GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_MOVE;
        }

    }else{ // If it's no trap or dragon, split emeralds 

        let splitResoult = EmeraldsDistibutor.DivideAmongThePlayer(selectedCard.Emeralds,GameInstance.Secret.PlayersActive.length,GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake);
        GameInstance.Public.data.PlayersPublic.forEach( player => {

            if( newDecision.includes(player.uid) ){
                player.pocket += splitResoult.byPlayer;
            }

        });

        GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake += splitResoult.forFuture;
       
    }

    GameInstance.Secret.PlayersActive = newDecision;
    GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_MOVE;

    return GameInstance;

}

const ShuffleDeck = (Cards: Card[]):Card[] => {

        let lenght:number = Cards.length;
        let position, buffer;

        while (lenght){
            position = Math.random() * (--lenght + 1) | 0;
            buffer = Cards[lenght];
            Cards[lenght] = Cards[position];
            Cards[position] = buffer
        } 
            
    return Cards;
}

const CheckIfRoundIsFinnished = (deck:Deck, Cards: number[]):{resoult:boolean, cardsToRemove:number[]} => {
    
    let TrapType:number = deck.GetCardType(Cards[Cards.length-1]);

    let cardsToRemove:number[] = Cards.filter(CardID => deck.GetCardType(CardID) === TrapType);

    let resoult:boolean = cardsToRemove.length === 3;

    return {resoult,cardsToRemove};
}
import { Deck } from "../../model/database/Deck";
import * as firebase from 'firebase-admin';
import { Game, GAME_STATE } from "../../model/database/Game";
import { Card } from "../../model/database/Card";
import { MINE_STATE } from "../../model/database/Mine";
import { PLAYER_DECISION } from "../../model/database/PlayerPrivate";
import { PlayerStatus } from "../../model/database/PlayerPublic";

import * as EmeraldsDistibutor from './EmeraldsDistributor';

export const ManageNextRound = (GameUID:String) => {

    let deck = new Deck();
    let cards = deck.Cards;

    return new Promise( (resolve,reject) => {

        firebase.database().ref(`GAME_LIST/${GameUID}`).transaction( (GameInstance:Game) => {

            if(GameInstance == null){
                return null;
            } 
            else{

                let newDecision:string[] = [];

                // Get Id of player who are going further
                GameInstance.PlayersPrivate.forEach( player => {
                    if(player.Decision == PLAYER_DECISION.GO && GameInstance.PlayersActive.includes(player.Uid) ){
                        newDecision.push(player.Uid);
                    }
                });

                // When no player decide to GO further , split non-split emeralds from prevoius round
                if(newDecision.length == 0){

                    let divideResoult = EmeraldsDistibutor.DivideAmongTheWinner(0, GameInstance.PlayersActive.length, GameInstance.Mines[GameInstance.CurrentMineID].EmeraldsForTake);

                    GameInstance.PlayersPrivate.forEach( player => {

                        if( GameInstance.PlayersActive.includes(player.Uid) ){
                            player.Chest += player.Pocket + divideResoult.byPlayer;
                        }

                        // This line is controversial, will incrase number of function call
                        player.Decision = PLAYER_DECISION.UNKNOWN;
                    });

                    // Move emerald from pocket to the chest
                    GameInstance.PlayersPublic.forEach( player => {
                        player.publicChest += GameInstance.PlayersPrivate.filter( privatePlayer => privatePlayer.Uid === player.uid)[0].Chest;
                    });

                    // Set pointer on next mine
                    GameInstance.Mines[GameInstance.CurrentMineID].MineState = MINE_STATE.VISITED;
                    GameInstance.CurrentMineID++;

                    // Check if next mine exist
                    if(GameInstance.MineNumber > GameInstance.CurrentMineID){
                        GameInstance.Mines[GameInstance.CurrentMineID].MineState = MINE_STATE.CURRENT;
                        GameInstance.GameState = GAME_STATE.WAITING_FOR_MOVE;
                    }else{
                        GameInstance.GameState = GAME_STATE.FINISHED;
                    }

                }else{ 

                    let returningPlayerNumber = GameInstance.PlayersPrivate.filter( player => {
                        return GameInstance.PlayersActive.includes(player.Uid) && !newDecision.includes(player.Uid);
                    }).length;

                    // Moving emerlds from pocket to the chest, setting flag to false
                    GameInstance.PlayersPrivate.forEach( player => {
                        if(!newDecision.includes(player.Uid)){
                            player.Chest += player.Pocket;
                            player.IsExploring = false;
                            if(returningPlayerNumber == 1){
                                player.Chest += GameInstance.Mines[GameInstance.CurrentMineID].EmeraldsForTake;
                                GameInstance.Mines[GameInstance.CurrentMineID].EmeraldsForTake = 0;
                            }
                        }
                    });

                    // Setting public flag for this player
                    GameInstance.PlayersPublic.forEach( player => {
                        if(!newDecision.includes(player.uid)){
                            player.status = PlayerStatus.RESTING;
                        }
                    });

                }
            
                //In case some brave adventurer will be found
                // Reset values (need for first round)
                if(GameInstance.RemovedCards == null){
                    GameInstance.RemovedCards = [];
                }

                if(GameInstance.Mines[GameInstance.CurrentMineID].Node == null){
                    GameInstance.Mines[GameInstance.CurrentMineID].Node = [];
                }

                //Filter cards
                cards = cards.filter((card:Card) => ( !GameInstance.RemovedCards.includes(card.CardID) &&  !GameInstance.Mines[GameInstance.CurrentMineID].Node.includes(card.CardID)) );
                cards = ShuffleDeck(cards);
                console.log("card filtered and shufled, first: "+cards[0].CardID);

                // Add selected cards (first one after shuffle)
                GameInstance.Mines[GameInstance.CurrentMineID].Node.push(cards[0].CardID);

                //Chack what card was selected
                if(deck.IsTrap(cards[0].CardID)){

                    let endOfTurnResoult = CheckIfRoundIsFinnished(deck,GameInstance.Mines[GameInstance.CurrentMineID].Node);

                    //If it`s 3rd trap or dragon
                    if(endOfTurnResoult.resoult || deck.IsDragon(cards[0].CardID)){

                        GameInstance.Mines[GameInstance.CurrentMineID].MineState = MINE_STATE.VISITED;
                        GameInstance.CurrentMineID++;

                        if(GameInstance.MineNumber > GameInstance.CurrentMineID){ // Check if there is more not-visited mines

                            GameInstance.Mines[GameInstance.CurrentMineID].MineState = MINE_STATE.CURRENT; 

                            if(endOfTurnResoult.resoult){
                                GameInstance.RemovedCards = GameInstance.RemovedCards.concat(endOfTurnResoult.cardsToRemove); // Add 3 trap ID's
                            }else{
                                GameInstance.RemovedCards.push(cards[0].CardID); // Add dragon's card id
                            }

                            // Reset players pocket, and bring public flag
                            GameInstance.PlayersPrivate.forEach( player => {
                                if(newDecision.includes(player.Uid)){
                                    player.Pocket = 0;
                                }
                                player.IsExploring = true;
                            });

                            // Set "dead" status, only use in resoult display
                            GameInstance.PlayersPublic.forEach( player => {
                                if(newDecision.includes(player.uid)){
                                    player.status = PlayerStatus.DEAD;
                                }
                            });

                        }else{
                            GameInstance.GameState = GAME_STATE.FINISHED;
                        }

                    }else{ 
                        GameInstance.GameState = GAME_STATE.WAITING_FOR_MOVE;
                    }

                }else{ // If it's no trap or dragon, split emeralds 

                    let splitResoult = EmeraldsDistibutor.DivideAmongThePlayer(cards[0].Emeralds,GameInstance.PlayersActive.length,GameInstance.Mines[GameInstance.CurrentMineID].EmeraldsForTake);
                    GameInstance.PlayersPrivate.forEach( player => {

                        if( newDecision.includes(player.Uid) ){
                            player.Pocket += splitResoult.byPlayer;
                        }

                    });

                    GameInstance.Mines[GameInstance.CurrentMineID].EmeraldsForTake += splitResoult.forFuture;
                    GameInstance.PlayersActive = newDecision;
                    GameInstance.GameState = GAME_STATE.WAITING_FOR_MOVE;
                }

                return GameInstance;
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


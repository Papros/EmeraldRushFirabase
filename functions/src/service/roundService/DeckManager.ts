import { Deck } from "../../model/database/Deck";
import * as firebase from 'firebase-admin';
import { Game, GAME_STATE } from "../../model/database/Game";
import { Card } from "../../model/database/Card";
import { MINE_STATE } from "../../model/database/Mine";
import { PLAYER_DECISION } from "../../model/database/PlayerPrivate";
import { PlayerStatus } from "../../model/database/PlayerPublic";

import * as EmeraldsDistibutor from './EmeraldsDistributor';

export const ManageNextRound = (GameUID:string) => {

    return new Promise( (resolve,reject) => {

        firebase.database().ref(`GAME_LIST/${GameUID}/game`).transaction( (GameInstance:Game) => {

            if(GameInstance == null){
                return null;
            } 
            else{

                if(GameInstance.Secret.GameState == GAME_STATE.WAITING_FOR_FIRST){
                    return PlayFirstCard(GameInstance);
                }
                else {
                    if(GameInstance.Secret.GameState == GAME_STATE.WAITING_FOR_CARD){
                        return PlayNextCard(GameInstance);
                    }else{
                        return GameInstance;
                    }
                }

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

const PlayNextCard = (GameInstance:Game):Game => {
 
    console.log("trying next card...");
    //============================================
    //==     CHECK IF ANYONE IS GOING FURTHER   ==
    //============================================

    let goingPlayer:string[] = [];
    let leavingPlayer:string[] = [];

    GameInstance.Private.PlayersPrivate.forEach( player => {
        if(player.IsExploring == true){
            if(player.Decision == PLAYER_DECISION.GO){
                goingPlayer.push(player.Uid);
            }else{
                leavingPlayer.push(player.Uid);
            }
        }
    });

    if(goingPlayer.length == 0){
    //============================================
    //==      IF NOBODY IS GOING FURTHER        ==
    //============================================

        GameInstance.Private.PlayersPrivate.forEach( player => {
            player.Decision = PLAYER_DECISION.GO;
            player.IsExploring = true;
        });

        GameInstance.Public.data.PlayersPublic.forEach( player => {

            if(leavingPlayer.includes(player.uid)){
                player.chest += player.pocket;
                if(leavingPlayer.length == 1){
                    player.chest += GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake;
                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake = 0;
                }
                player.status = PlayerStatus.RESTING;
            }

        });

        
        if( GameInstance.Public.data.MineNumber > GameInstance.Public.data.CurrentMineID + 1){
            GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.VISITED;
            GameInstance.Public.data.CurrentMineID++;
            GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.NOT_VISITED;
            GameInstance.Public.data.PublicState = GAME_STATE.WAITING_FOR_FIRST;
            GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_FIRST;
        }else{
            GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.VISITED;
            GameInstance.Public.data.PublicState = GAME_STATE.FINISHED;
            GameInstance.Secret.GameState = GAME_STATE.FINISHED;
        }

        GameInstance.Secret.DecisionDeadline = Date.now() + (GameInstance.Secret.DecisionTolerance + GameInstance.Public.data.RoundCooldownTime)*1000;
        return GameInstance;

    }else{

    //============================================
    //==       I SOMEBODY IS GOING FURTHER      ==
    //============================================

        // Moving emerlads from pocket to chest, settings status to resting and IsExploring to false
        GameInstance.Public.data.PlayersPublic.forEach( player => {

            if(leavingPlayer.includes(player.uid)){
                
                if(leavingPlayer.length == 1){
                    player.pocket += GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake;
                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake = 0;
                }

                player.chest += player.pocket;
                player.status = PlayerStatus.RESTING;
            }

        });

        GameInstance.Private.PlayersPrivate.forEach( player => {
            if(leavingPlayer.includes(player.Uid)){
                player.IsExploring = false;
            }
        });

        if(GameInstance.Secret.RemovedCards == undefined){
            GameInstance.Secret.RemovedCards = [];
        }

        // Selecting card
        let selectedCard = GetCard(GameInstance.Secret.RemovedCards,
                                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node,
                                      GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node.length >= GameInstance.Public.data.DragonMinimalDeep);  

        GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node.push(selectedCard.CardID);

        //If emerlds selected
        if(selectedCard.IsEmeralds()){

            let redistributeResoult = EmeraldsDistibutor.DivideAmongThePlayer(selectedCard.Emeralds,
                                                                                goingPlayer.length,
                                                                                GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].EmeraldsForTake);
    
            GameInstance.Public.data.PlayersPublic.forEach( player => {
                if(goingPlayer.includes(player.uid)){
                    player.pocket = redistributeResoult.byPlayer;
                }
            });

            GameInstance.Public.data.Mines[ GameInstance.Public.data.CurrentMineID ].EmeraldsForTake = redistributeResoult.forFuture;
            
            GameInstance.Private.PlayersPrivate.forEach( player => {
                player.Decision = PLAYER_DECISION.UNKNOWN;
            });

            GameInstance.Public.data.PublicState = GAME_STATE.WAITING_FOR_MOVE;
            GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_MOVE;

            GameInstance.Public.data.RoundID++;
            GameInstance.Secret.DecisionDeadline = (GameInstance.Public.data.DecisionTime + GameInstance.Secret.DecisionTolerance)*1000 + Date.now();
            return GameInstance;

        }else{

            let checkResoult = CheckIfRoundIsFinnished(GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].Node);

            if(checkResoult.IsRoundFinished || selectedCard.IsDragon()){

                if(GameInstance.Secret.RemovedCards == undefined){
                    GameInstance.Secret.RemovedCards = [];
                }

                if(checkResoult.IsRoundFinished){
                    GameInstance.Secret.RemovedCards = GameInstance.Secret.RemovedCards.concat(checkResoult.CardsToBeRemovedID);
                }
                else{
                    GameInstance.Secret.RemovedCards.push(selectedCard.CardID);
                }

                GameInstance.Private.PlayersPrivate.forEach( player => {
                    player.IsExploring = true;
                    player.Decision = PLAYER_DECISION.GO;
                });

                GameInstance.Public.data.PlayersPublic.forEach( player => {
                    if(goingPlayer.includes(player.uid)){
                        player.status = PlayerStatus.DEAD;
                    }

                });

                if( GameInstance.Public.data.MineNumber > GameInstance.Public.data.CurrentMineID + 1){
                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.VISITED;
                    GameInstance.Public.data.CurrentMineID++;
                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.NOT_VISITED;
                    GameInstance.Public.data.PublicState = GAME_STATE.WAITING_FOR_FIRST;
                    GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_FIRST;
                }else{
                    GameInstance.Public.data.Mines[GameInstance.Public.data.CurrentMineID].MineState = MINE_STATE.VISITED;
                    GameInstance.Public.data.PublicState = GAME_STATE.FINISHED;
                    GameInstance.Secret.GameState = GAME_STATE.FINISHED;
                }
        
                GameInstance.Secret.DecisionDeadline = Date.now() + (GameInstance.Secret.DecisionTolerance + GameInstance.Public.data.RoundCooldownTime)*1000;
                return GameInstance;

            }else{

                GameInstance.Private.PlayersPrivate.forEach( player => {
                    player.Decision = PLAYER_DECISION.UNKNOWN;
                });

                GameInstance.Public.data.PublicState = GAME_STATE.WAITING_FOR_MOVE;
                GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_MOVE;

                GameInstance.Public.data.RoundID++;
                GameInstance.Secret.DecisionDeadline = Date.now() + (GameInstance.Secret.DecisionTolerance + GameInstance.Public.data.DecisionTime)*1000;
                return GameInstance;


            }

        }
        

    }


}

const PlayFirstCard = (GameInstance:Game):Game => {
     //============================================
    //==            GAME START                  ==
    //============================================

    if(GameInstance.Secret.RemovedCards == undefined){
        GameInstance.Secret.RemovedCards = [];
    }

    let selectedCard = GetCard(GameInstance.Secret.RemovedCards, [], false);

    GameInstance.Public.data.PlayersPublic.forEach( player => {
        player.status = PlayerStatus.EXPLORING;
        player.pocket = 0;
    });

    if(selectedCard.IsEmeralds()){
        let redistributeResoult = EmeraldsDistibutor.DivideAmongThePlayer(selectedCard.Emeralds,GameInstance.Private.PlayersPrivate.length,0);

        GameInstance.Public.data.PlayersPublic.forEach( player => {
            player.pocket = redistributeResoult.byPlayer;
        });

        GameInstance.Public.data.Mines[ GameInstance.Public.data.CurrentMineID ].EmeraldsForTake = redistributeResoult.forFuture;

    }

    GameInstance.Public.data.Mines[ GameInstance.Public.data.CurrentMineID ].Node = [selectedCard.CardID];

    GameInstance.Private.PlayersPrivate.forEach( player => {
        player.Decision = PLAYER_DECISION.UNKNOWN;
    });

    GameInstance.Public.data.PublicState = GAME_STATE.WAITING_FOR_MOVE;
    GameInstance.Secret.GameState = GAME_STATE.WAITING_FOR_MOVE;
    GameInstance.Secret.DecisionDeadline = Date.now() + (GameInstance.Secret.DecisionTolerance + GameInstance.Public.data.DecisionTime)*1000;
    
    console.log("Return first card");
    GameInstance.Public.data.RoundID++;
    return GameInstance;

}

const GetCard = (removedCardsID: number[], onBoardCardsID: number[], IsDragonAwailable: boolean = false):Card => {

    let cardDeck = new Deck();
    let cards = cardDeck.Cards;

    cards = cards.filter((card:Card) => ( !removedCardsID.includes(card.CardID) &&  !onBoardCardsID.includes(card.CardID)) );
    cards = ShuffleDeck(cards);

    if(IsDragonAwailable){
        return cards[0];
    }else{
        return (cards[0].IsDragon() ? cards[1] : cards[0])
    }

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

const CheckIfRoundIsFinnished = (onBoardCardsID: number[]):{IsRoundFinished:boolean, CardsToBeRemovedID:number[]} => {
    
    let deck = new Deck();
    
    let TrapType:number = deck.GetCardType(onBoardCardsID[onBoardCardsID.length-1]);

    let cardsToRemove:number[] = onBoardCardsID.filter(CardID => deck.GetCardType(CardID) === TrapType);

    let resoult:boolean = cardsToRemove.length === 3;

    return {IsRoundFinished: resoult,CardsToBeRemovedID: cardsToRemove};
}


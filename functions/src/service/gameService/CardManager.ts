import { Deck } from "../../model/game/Deck";
import * as firebase from 'firebase-admin';
import { Game } from "../../model/database/Game";
import { Card } from "../../model/game/Card";

export const GiveNewCard = (GameUID:String) => {

    let cards = new Deck().Cards;

    return new Promise( (resolve,reject) => {

        firebase.database().ref(`GAME_LIST/${GameUID}`).transaction( (GameInstance:Game) => {
            if(GameInstance == null){
                console.log("null for that moment...");
                return null;
            } 
            else{
                console.log("Get data of: "+GameInstance.GameUID);

                if(!!GameInstance.RemovedCards){
                    cards = cards.filter((card:Card) => !GameInstance.RemovedCards.includes(card.CardID));
                }

                cards = shuffle(cards);

                console.log("card filtered and shufled");

                if(!!GameInstance.Mines[GameInstance.CurrentMineID].Node){
                    GameInstance.Mines[GameInstance.CurrentMineID].Node = [];
                }

                GameInstance.Mines[GameInstance.CurrentMineID].Node.push(cards[0].CardID);

                console.log("Gets card of id: "+cards[0].CardID);
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

const shuffle = (Cards: Card[]):Card[] => {

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
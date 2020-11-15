import { Card, CARD_TYPE } from "./Card";


export class Deck {
    
    Cards: Card[];

    constructor(){

        this.Cards = [];

        this.Cards.push(new Card(0,CARD_TYPE.LAVA));
        this.Cards.push(new Card(1,CARD_TYPE.LAVA));
        this.Cards.push(new Card(2,CARD_TYPE.LAVA));
        this.Cards.push(new Card(3,CARD_TYPE.ROCKS));
        this.Cards.push(new Card(4,CARD_TYPE.ROCKS));
        this.Cards.push(new Card(5,CARD_TYPE.ROCKS));
        this.Cards.push(new Card(6,CARD_TYPE.SNAKES));
        this.Cards.push(new Card(7,CARD_TYPE.SNAKES));
        this.Cards.push(new Card(8,CARD_TYPE.SNAKES));
        this.Cards.push(new Card(9,CARD_TYPE.SPIDERS));
        this.Cards.push(new Card(10,CARD_TYPE.SPIDERS));
        this.Cards.push(new Card(11,CARD_TYPE.TRAP));
        this.Cards.push(new Card(12,CARD_TYPE.TRAP));
        this.Cards.push(new Card(13,CARD_TYPE.TRAP));
        this.Cards.push(new Card(14,CARD_TYPE.DRAGON));

        this.Cards.push(new Card(15,CARD_TYPE.ARTIFACT,12));
        this.Cards.push(new Card(16,CARD_TYPE.ARTIFACT,10));
        this.Cards.push(new Card(17,CARD_TYPE.ARTIFACT,8));
        this.Cards.push(new Card(18,CARD_TYPE.ARTIFACT,7));
        this.Cards.push(new Card(19,CARD_TYPE.ARTIFACT,5));

        this.Cards.push(new Card(20,CARD_TYPE.DIAMONDS,1));
        this.Cards.push(new Card(21,CARD_TYPE.DIAMONDS,2));
        this.Cards.push(new Card(22,CARD_TYPE.DIAMONDS,3));
        this.Cards.push(new Card(23,CARD_TYPE.DIAMONDS,4));
        this.Cards.push(new Card(24,CARD_TYPE.DIAMONDS,5));

        this.Cards.push(new Card(25,CARD_TYPE.DIAMONDS,5));
        this.Cards.push(new Card(26,CARD_TYPE.DIAMONDS,7));
        this.Cards.push(new Card(27,CARD_TYPE.DIAMONDS,7));
        this.Cards.push(new Card(28,CARD_TYPE.DIAMONDS,9));
        this.Cards.push(new Card(29,CARD_TYPE.DIAMONDS,9));

        this.Cards.push(new Card(30,CARD_TYPE.DIAMONDS,11));
        this.Cards.push(new Card(31,CARD_TYPE.DIAMONDS,11));
        this.Cards.push(new Card(32,CARD_TYPE.DIAMONDS,14));
        this.Cards.push(new Card(33,CARD_TYPE.DIAMONDS,15));
        this.Cards.push(new Card(34,CARD_TYPE.DIAMONDS,17));
        
    }

    IsTrap = (CardId: number):boolean => {
        return this.Cards[CardId].IsTrap();
    }

    IsDragon = (CardId: number):boolean => {
        return this.Cards[CardId].IsDragon();
    }

    GetEmeraldValue = (CardID: number):number => {
        return this.Cards[CardID].Emeralds;
    }

    GetCardType = (CardID: number): number => {
       return this.Cards[CardID].CardType;
    }

}
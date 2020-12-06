
export enum CARD_TYPE {
    DIAMONDS, ARTIFACT, LAVA, TRAP, SPIDERS, SNAKES, ROCKS, DRAGON
}

export class Card{

    Emeralds: number;
    CardType: number;
    CardID: number;

    constructor(cardId:number, cardType: CARD_TYPE, emeralds: number = 0){
        this.Emeralds = emeralds;
        this.CardType = cardType;
        this.CardID = cardId;
    }

    IsTrap = ():boolean => (this.CardType != CARD_TYPE.ARTIFACT && this.CardType != CARD_TYPE.DIAMONDS);
    
    IsDragon = ():boolean => (this.CardType == CARD_TYPE.DRAGON);

    IsEmeralds = ():boolean =>(this.CardType == CARD_TYPE.DIAMONDS || this.CardType == CARD_TYPE.ARTIFACT);
    
}


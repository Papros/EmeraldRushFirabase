
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

    IsTrap = ():boolean => {
        return (this.CardType == CARD_TYPE.DRAGON) || (this.CardType == CARD_TYPE.LAVA)   || 
                (this.CardType == CARD_TYPE.ROCKS) || (this.CardType == CARD_TYPE.SNAKES) || 
                (this.CardType == CARD_TYPE.TRAP)  || (this.CardType == CARD_TYPE.SPIDERS);
    }

    IsDragon = ():boolean => (this.CardType == CARD_TYPE.DRAGON);
}


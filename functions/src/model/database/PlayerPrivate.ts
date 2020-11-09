
export enum PLAYER_DECISION {
    GO, BACK, UNKNOWN
}

export class PlayerPrivate {

    id: number;
    uid: string;
    chest: number;
    pocket: number;
    decision: PLAYER_DECISION;
    exploring: boolean;

    constructor (id:number, uid:string){
        this.id = id;
        this.uid = uid;
        this.chest = 0;
        this.pocket = 0;
        this.exploring = true;
        this.decision = PLAYER_DECISION.GO;
    }

}
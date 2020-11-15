
export enum PLAYER_DECISION {
    GO, BACK, UNKNOWN
}

export class PlayerPrivate {

    Id: number;
    Uid: string;
    Chest: number;
    Pocket: number;
    Decision: number;
    IsExploring: boolean;

    constructor (id:number, uid:string){
        this.Id = id;
        this.Uid = uid;
        this.Chest = 0;
        this.Pocket = 0;
        this.IsExploring = true;
        this.Decision = PLAYER_DECISION.GO;
    }

}
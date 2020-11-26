
export enum PLAYER_DECISION {
    BACK, GO, UNKNOWN
}

export class PlayerPrivate {

    Id: number;
    Uid: string;
    Decision: number;
    DecisionTimestamp: number;
    IsExploring: boolean;

    constructor (id:number, uid:string){
        this.Id = id;
        this.Uid = uid;
        this.IsExploring = true;
        this.DecisionTimestamp = 0;
        this.Decision = PLAYER_DECISION.GO;
    }

}
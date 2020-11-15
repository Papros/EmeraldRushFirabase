
export enum MINE_STATE{
    VISITED, NOT_VISITED, CURRENT
}

export class Mine {

    Node: number[];
    MineState: number;
    EmeraldsForTake: number;
    LastMoveTimestamp: number;

    constructor(){
        this.MineState = MINE_STATE.NOT_VISITED;
        this.Node = [];
        this.LastMoveTimestamp = -1;
        this.EmeraldsForTake = 0;
    }
    
}

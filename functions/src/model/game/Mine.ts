
export enum MINE_STATE{
    VISITED, NOT_VISITED, CURRENT
}

export class Mine {

    Node: number[];
    MineState: number;
    EmeraldsForTake: number;

    constructor(){
        this.MineState = MINE_STATE.NOT_VISITED;
        this.Node = [];
        this.EmeraldsForTake = 0;
    }

    /*
    Visit = () => {
        this.MineState = MINE_STATE.CURRENT;
    }

    Leave = () => {
        this.MineState = MINE_STATE.VISITED;
    }

    RevealNextNode = () => {
        this.Node.push()
    }*/
    
}

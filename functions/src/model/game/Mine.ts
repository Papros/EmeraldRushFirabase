import { Card } from "./Card";

enum MINE_STATE{
    VISITED, NOT_VISITED, CURRENT
}

export class Mine {

    Node: Card[];
    MineState: MINE_STATE;

    constructor(){
        this.MineState = MINE_STATE.NOT_VISITED;
        this.Node = [];
    }

    Visit = () => {
        this.MineState = MINE_STATE.CURRENT;
    }

    Leave = () => {
        this.MineState = MINE_STATE.VISITED;
    }

    RevealNextNode = () => {
        this.Node.push()
    }
    
}
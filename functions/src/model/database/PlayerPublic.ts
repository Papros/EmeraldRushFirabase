
export enum PlayerStatus {
    EXPLORING, RESTING, DEAD
}

export class PlayerPublic {

    id: number;
    name: string;
    emotion: number;
    publicChest: number;
    status: number;

    constructor (id:number, name:string){
        this.id = id;
        this.name = name;
        this.emotion = 0;
        this.publicChest = 0;
        this.status = PlayerStatus.EXPLORING;
    }

}


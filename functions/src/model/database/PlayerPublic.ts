
export enum PlayerStatus {
    EXPLORING, RESTING, DEAD
}

export class PlayerPublic {

    id: number;
    uid: string;
    name: string;
    emotion: number;
    publicChest: number;
    status: number;

    constructor (id:number, name:string, uid: string){
        this.id = id;
        this.name = name;
        this.uid = uid;
        this.emotion = 0;
        this.publicChest = 0;
        this.status = PlayerStatus.EXPLORING;
    }

}


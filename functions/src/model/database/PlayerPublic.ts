
export enum PlayerStatus {
    EXPLORING, RESTING, DEAD
}

export class PlayerPublic {

    id: number;
    uid: string;
    name: string;
    emotion: number;
    chest: number;
    pocket: number;
    status: number;

    constructor (id:number, name:string, uid: string){
        this.id = id;
        this.name = name;
        this.uid = uid;
        this.emotion = 0;
        this.pocket = 0;
        this.chest = 0;
        this.status = PlayerStatus.EXPLORING;
    }

}


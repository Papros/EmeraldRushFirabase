export class PlayerPrivate {

    id: number;
    uid: string;
    chest: number;
    pocket: number;

    constructor (id:number, uid:string){
        this.id = id;
        this.uid = uid;
        this.chest = 0;
        this.pocket = 0;
    }

}
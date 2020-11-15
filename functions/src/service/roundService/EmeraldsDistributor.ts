
export const DivideAmongThePlayer = (inThisRound: number, player: number, fromPrevoiusRound: number):{byPlayer:number, forFuture:number} => {

    let rest = inThisRound % player;
    let byPlayer = (inThisRound - rest) / player;
    let forFuture = rest;

    return {byPlayer,forFuture};
}

export const DivideAmongTheWinner  = (inThisRound: number, player: number, fromPrevoiusRound: number):{byPlayer:number, forFuture:number} => {

    let rest = inThisRound % player;
    let byPlayer = (inThisRound - rest) / player;
    let forFuture = rest;

    if(forFuture + fromPrevoiusRound > player){

        let extra = forFuture+fromPrevoiusRound;
        forFuture = extra % player;
        byPlayer += (extra - forFuture) / player;
    }

    return {byPlayer,forFuture};
} 
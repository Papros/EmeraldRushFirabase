import * as functions from 'firebase-functions';



export const helloWorld = functions.database.ref("QUEUE/{UserUID}").onUpdate((snaphot,context) => {

    const ModeOfNewPlayer = snaphot.after.child("QUEUE").child(context.params.UserUID).val();

    switch(ModeOfNewPlayer){
        case "GAME_2_PLAYERS": snaphot.after.child("QUEUE").key break;
        case "GAME_4_PLAYERS": break;
        case "GAME_8_PLAYERS": break;
        default: break;
    }

});
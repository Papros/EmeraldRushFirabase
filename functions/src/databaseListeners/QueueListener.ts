import * as functions from 'firebase-functions';
import * as QueueManager from '../service/QueueManager';

export const QueueListener = functions.database.ref("/QUEUE/{userUID}").onCreate((snapshot,context) => {

    const userData = snapshot.val();
    const game_mode = userData.GameMode;
    QueueManager.SearchInQueue(game_mode, snapshot);

 });

 
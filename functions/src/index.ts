import * as QueueManager from './service/QueueManager';
import * as GameStateManager from './service/gameService/GameStateListener'
import * as firebase from 'firebase-admin';

export const QueueListener = QueueManager.QueueListener;
export const GameStateListener = GameStateManager.GameStateListener;

firebase.initializeApp();

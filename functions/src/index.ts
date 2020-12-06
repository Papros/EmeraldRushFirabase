import * as QueueManager from './databaseListeners/QueueListener';
import * as GameStateManager from './databaseListeners/GameStateListener';
import * as firebase from 'firebase-admin';

export const QueueListener = QueueManager.QueueListener;
export const GameStateUpdateListener = GameStateManager.GameStateUpdateListener;
export const GameStateCreateListener = GameStateManager.GameStateCreateListener;

firebase.initializeApp();

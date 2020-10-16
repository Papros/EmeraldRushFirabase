import * as QueueManager from './service/QueueManager';
import * as firebase from 'firebase-admin';

export const QueueListener = QueueManager.QueueListener;

firebase.initializeApp();

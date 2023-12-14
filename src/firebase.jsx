// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import {getStorage} from 'firebase/storage'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyChcRoRP3NiiCEeU3sMPgpK5Mkwt6_lh2U",
  authDomain: "rocketgram-1c4e9.firebaseapp.com",
  databaseURL:
    "https://rocketgram-1c4e9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
  storageBucket: "rocketgram-1c4e9.appspot.com",
  messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_APP_ID,
  measurementId: import.meta.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app)
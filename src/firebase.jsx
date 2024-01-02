// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ3ogAK_SmFlDWW1-IszCEHQnOEGEwNPA",
  authDomain: "rocketgram-609cd.firebaseapp.com",
  projectId: "rocketgram-609cd",
  storageBucket: "rocketgram-609cd.appspot.com",
  messagingSenderId: "931493654022",
  appId: "1:931493654022:web:c3d239574628bb39391d87",
  measurementId: "G-S8BTQVPZ9W",
  databaseURL: "https://rocketgram-609cd-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);

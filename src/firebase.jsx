// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//firebase real time database stuff
import { getDatabase } from "firebase/database";

//Storage stuff
import { getStorage } from "firebase/storage";

//firebase auth stuff
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://rocketgram-508f1-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.VITE_REACT_APP_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
//reference to storage
export const storage = getStorage(firebaseApp);
//reference to authentification
export const auth = getAuth(firebaseApp);

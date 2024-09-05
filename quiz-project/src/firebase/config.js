import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyDcPZ2BpsHEbONXoz8TxslwH0LNDIZpl3g",
  authDomain: "quizhub-411fd.firebaseapp.com",
  databaseURL: "https://quizhub-411fd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizhub-411fd",
  storageBucket: "gs://quizhub-411fd.appspot.com",
  messagingSenderId: "1045739663248",
  appId: "1:1045739663248:web:a5b319589c548cbe938d15"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
export const db = getDatabase(app);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
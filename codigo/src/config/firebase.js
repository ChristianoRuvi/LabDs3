import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6t3M3pB1K7_v1BpgGWzcb0mcK96pAn8g",
  authDomain: "moeda-estudantil-final.firebaseapp.com",
  projectId: "moeda-estudantil-final",
  storageBucket: "moeda-estudantil-final.appspot.com",
  messagingSenderId: "804226385463",
  appId: "1:804226385463:web:2b66eefe4e40671f2a21b2",
  measurementId: "G-TT11ZLG44F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
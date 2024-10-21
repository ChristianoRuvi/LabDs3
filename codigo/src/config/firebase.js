import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFM7oN1gFntvJEFF0vl4YUcMA4gyAYaic",
    authDomain: "moeda-estudantil.firebaseapp.com",
    projectId: "moeda-estudantil",
    storageBucket: "moeda-estudantil.appspot.com",
    messagingSenderId: "282521658357",
    appId: "1:282521658357:web:f510ed58e6fb5ee8acb6bc",
    measurementId: "G-KH1TR5Z1N5"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
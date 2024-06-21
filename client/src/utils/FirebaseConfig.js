import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBMhLentkpya2Z6UgwJdEKEbaPWhNLrXbo",
    authDomain: "caht-app-408709.firebaseapp.com",
    projectId: "caht-app-408709",
    storageBucket: "caht-app-408709.appspot.com",
    messagingSenderId: "1088363640492",
    appId: "1:1088363640492:web:f1fb4aadd470eee6e05109",
    measurementId: "G-5QM3304QXP"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);

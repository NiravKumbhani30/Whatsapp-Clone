import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "your apiKey of firebase",
    authDomain: "your authDomain of firebase",
    projectId: "your projectId of firebase",
    storageBucket: "your storageBucket of firebase",
    messagingSenderId: "your messagingSenderId of firebase",
    appId: "your appId of firebase",
    measurementId: "your measurementId of firebaseP"
};
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);

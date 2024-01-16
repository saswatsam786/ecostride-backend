// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAdVG57t2f9jXkL5yBfAziUIgOSb9tA1D8",
    authDomain: "ecostride-333d8.firebaseapp.com",
    projectId: "ecostride-333d8",
    storageBucket: "ecostride-333d8.appspot.com",
    messagingSenderId: "446449876620",
    appId: "1:446449876620:web:a2080fd235ef451ba205a9",
    measurementId: "G-WJ954HBP94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { db }
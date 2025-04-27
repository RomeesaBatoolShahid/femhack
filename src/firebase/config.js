// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzv8V5n-B0ILf7YjedhEsFpfQdn3OSaUo",
  authDomain: "trello-78965.firebaseapp.com",
  projectId: "trello-78965",
  storageBucket: "trello-78965.firebasestorage.app",
  messagingSenderId: "568051421031",
  appId: "1:568051421031:web:3990bd342718e2ac0969c2",
  measurementId: "G-SVGNXSRJCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


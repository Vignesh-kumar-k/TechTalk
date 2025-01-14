// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYgZ2r4MoK7fvyEanEsSqqQ2mnh5E-Z1M",
  authDomain: "techtalk-co.firebaseapp.com",
  projectId: "techtalk-co",
  storageBucket: "techtalk-co.firebasestorage.app",
  messagingSenderId: "881905866671",
  appId: "1:881905866671:web:3bab675d61b066187f815a",
  measurementId: "G-GBBW62GZ98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
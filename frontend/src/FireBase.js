// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import storage module

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYgZ2r4MoK7fvyEanEsSqqQ2mnh5E-Z1M",
  authDomain: "techtalk-co.firebaseapp.com",
  projectId: "techtalk-co",
  storageBucket: "techtalk-co.appspot.com", // Corrected storage bucket
  messagingSenderId: "881905866671",
  appId: "1:881905866671:web:3bab675d61b066187f815a",
  measurementId: "G-GBBW62GZ98",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize individual services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export storage

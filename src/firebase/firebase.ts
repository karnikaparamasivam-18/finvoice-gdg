import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA21geIna6Z7GK7mTNzFKa-f_Gddia5Tsg",
  authDomain: "shg-accounting.firebaseapp.com",
  projectId: "shg-accounting",
  storageBucket: "shg-accounting.firebasestorage.app",
  messagingSenderId: "838556296882",
  appId: "1:838556296882:web:439dddd31486593dce0bab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

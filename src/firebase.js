// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHulLQHzEczsF-EtGCy2hsFqQmEpecst4",
  authDomain: "chatbot-frontend-70f0e.firebaseapp.com",
  projectId: "chatbot-frontend-70f0e",
  storageBucket: "chatbot-frontend-70f0e.firebasestorage.app",
  messagingSenderId: "776390574734",
  appId: "1:776390574734:web:b1386822913c39536a3fdf",
  measurementId: "G-GFHS6JNBW5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Export auth functions directly
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };


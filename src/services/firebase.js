// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCKa9GhknMDjnifJgeLKXyS3jMkZSk-Kk",
  authDomain: "shaktishield-30830.firebaseapp.com",
  projectId: "shaktishield-30830",
  storageBucket: "shaktishield-30830.firebasestorage.app",
  messagingSenderId: "851305362566",
  appId: "1:851305362566:web:d82cf148624db290288d07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firebase Firestore
export const db = getFirestore(app);

// Export Firebase app
export default app;
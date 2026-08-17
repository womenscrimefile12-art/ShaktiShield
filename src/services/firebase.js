// src/services/firebase.js

import { initializeApp } from "firebase/app";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

// =========================================================
// FIREBASE CONFIGURATION
// =========================================================

const firebaseConfig = {
  apiKey: "AIzaSyDCKa9GhknMDjnifJgeLKXyS3jMkZSk-Kk",
  authDomain: "shaktishield-30830.firebaseapp.com",
  projectId: "shaktishield-30830",
  storageBucket: "shaktishield-30830.firebasestorage.app",
  messagingSenderId: "851305362566",
  appId: "1:851305362566:web:d82cf148624db290288d07",
};

// =========================================================
// INITIALIZE FIREBASE
// =========================================================

const app = initializeApp(firebaseConfig);

// =========================================================
// FIREBASE AUTHENTICATION
// =========================================================

export const auth = getAuth(app);

// =========================================================
// KEEP USER LOGGED IN
//
// browserLocalPersistence means:
// - Refreshing the page does NOT log the user out
// - Closing and reopening the browser normally keeps
//   the Firebase session
// - The user only logs out when logoutUser() is called
// =========================================================

export const authPersistence = setPersistence(
  auth,
  browserLocalPersistence
);

// =========================================================
// FIRESTORE DATABASE
// =========================================================

export const db = getFirestore(app);

// =========================================================
// EXPORT APP
// =========================================================

export default app;
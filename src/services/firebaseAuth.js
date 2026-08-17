// src/services/firebaseAuth.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async ({
  name,
  email,
  phone,
  password,
}) => {
  // Create Firebase Authentication account
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const firebaseUser = credential.user;

  // User data stored in Firestore
  const userData = {
    uid: firebaseUser.uid,
    name: name || "",
    email: firebaseUser.email || email,
    phone: phone || "",
    role: "user",
    createdAt: new Date().toISOString(),
  };

  // Create users/{uid} document
  await setDoc(
    doc(db, "users", firebaseUser.uid),
    userData
  );

  return userData;
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (email, password) => {
  // Sign in using Firebase Authentication
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const firebaseUser = credential.user;

  // Get additional user information from Firestore
  const userDoc = await getDoc(
    doc(db, "users", firebaseUser.uid)
  );

  // If Firestore document exists
  if (userDoc.exists()) {
    return userDoc.data();
  }

  // Fallback if user document does not exist
  return {
    uid: firebaseUser.uid,
    name: "",
    email: firebaseUser.email || email,
    phone: "",
    role: "user",
  };
};

// ==========================================
// GET USER DATA
// ==========================================

export const getUserData = async (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }

  const userDoc = await getDoc(
    doc(db, "users", firebaseUser.uid)
  );

  if (userDoc.exists()) {
    return userDoc.data();
  }

  // Fallback user data
  return {
    uid: firebaseUser.uid,
    name: "",
    email: firebaseUser.email || "",
    phone: "",
    role: "user",
  };
};

// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = async () => {
  await signOut(auth);
};

// ==========================================
// AUTHENTICATION LISTENER
// ==========================================

export const listenToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
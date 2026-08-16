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
// REGISTER
// ==========================================

export const registerUser = async ({
  name,
  email,
  phone,
  password,
}) => {

  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser = credential.user;

  const userData = {
    uid: firebaseUser.uid,
    name,
    email: firebaseUser.email,
    phone: phone || "",
    role: "user",
    createdAt: new Date().toISOString(),
  };

  await setDoc(
    doc(db, "users", firebaseUser.uid),
    userData
  );

  return userData;
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (
  email,
  password
) => {

  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser = credential.user;

  const userDoc = await getDoc(
    doc(db, "users", firebaseUser.uid)
  );

  if (userDoc.exists()) {
    return userDoc.data();
  }

  return {
    uid: firebaseUser.uid,
    name: "",
    email: firebaseUser.email,
    phone: "",
    role: "user",
  };
};


// ==========================================
// GET USER DATA
// ==========================================

export const getUserData = async (
  firebaseUser
) => {

  if (!firebaseUser) {
    return null;
  }

  const userDoc = await getDoc(
    doc(db, "users", firebaseUser.uid)
  );

  if (userDoc.exists()) {
    return userDoc.data();
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: "user",
  };
};


// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = async () => {
  await signOut(auth);
};


// ==========================================
// AUTH LISTENER
// ==========================================

export const listenToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
// src/services/firebaseAuth.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
  authPersistence,
} from "./firebase";

// =========================================================
// WAIT FOR FIREBASE AUTH PERSISTENCE
// =========================================================

const waitForAuthPersistence = async () => {
  try {
    await authPersistence;
  } catch (error) {
    console.error(
      "Firebase persistence setup failed:",
      error
    );
  }
};

// =========================================================
// REGISTER USER
// =========================================================

export const registerUser = async ({
  name,
  email,
  phone,
  password,
}) => {
  await waitForAuthPersistence();

  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPhone = (phone || "").trim();

  if (!cleanName) {
    throw new Error("Please enter your name.");
  }

  if (!cleanEmail) {
    throw new Error("Please enter your email.");
  }

  if (!password) {
    throw new Error("Please enter a password.");
  }

  if (password.length < 6) {
    throw new Error(
      "Password must contain at least 6 characters."
    );
  }

  try {
    // -----------------------------------------------------
    // CREATE FIREBASE AUTH ACCOUNT
    // -----------------------------------------------------

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

    const firebaseUser = credential.user;

    // -----------------------------------------------------
    // SAVE DISPLAY NAME TO FIREBASE AUTH
    // -----------------------------------------------------

    try {
      await updateProfile(firebaseUser, {
        displayName: cleanName,
      });
    } catch (profileError) {
      console.warn(
        "Could not update Firebase display name:",
        profileError
      );
    }

    // -----------------------------------------------------
    // USER DOCUMENT
    // -----------------------------------------------------

    const userData = {
      uid: firebaseUser.uid,
      name: cleanName,
      email: firebaseUser.email || cleanEmail,
      phone: cleanPhone,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // -----------------------------------------------------
    // SAVE USER TO FIRESTORE
    // users/{uid}
    // -----------------------------------------------------

    await setDoc(
      doc(db, "users", firebaseUser.uid),
      userData,
      {
        merge: true,
      }
    );

    // -----------------------------------------------------
    // RETURN FRONTEND-SAFE USER
    // -----------------------------------------------------

    return {
      uid: firebaseUser.uid,
      name: cleanName,
      email: firebaseUser.email || cleanEmail,
      phone: cleanPhone,
      role: "user",
    };

  } catch (error) {
    console.error(
      "Firebase registration error:",
      error
    );

    throw convertFirebaseError(error);
  }
};

// =========================================================
// LOGIN USER
// =========================================================

export const loginUser = async (
  email,
  password
) => {
  await waitForAuthPersistence();

  const cleanEmail =
    (email || "").trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error("Please enter your email.");
  }

  if (!password) {
    throw new Error("Please enter your password.");
  }

  try {
    // -----------------------------------------------------
    // SIGN IN
    // -----------------------------------------------------

    const credential =
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

    const firebaseUser =
      credential.user;

    // -----------------------------------------------------
    // LOAD USER DOCUMENT FROM FIRESTORE
    // -----------------------------------------------------

    return await getUserData(firebaseUser);

  } catch (error) {
    console.error(
      "Firebase login error:",
      error
    );

    throw convertFirebaseError(error);
  }
};

// =========================================================
// GET USER DATA
// =========================================================

export const getUserData = async (
  firebaseUser
) => {
  if (!firebaseUser) {
    return null;
  }

  try {
    const userRef = doc(
      db,
      "users",
      firebaseUser.uid
    );

    const userDoc =
      await getDoc(userRef);

    // -----------------------------------------------------
    // FIRESTORE USER EXISTS
    // -----------------------------------------------------

    if (userDoc.exists()) {
      const data = userDoc.data();

      return {
        uid: firebaseUser.uid,

        name:
          data.name ||
          firebaseUser.displayName ||
          "",

        email:
          data.email ||
          firebaseUser.email ||
          "",

        phone:
          data.phone ||
          "",

        role:
          data.role ||
          "user",
      };
    }

    // -----------------------------------------------------
    // FIRESTORE DOCUMENT DOES NOT EXIST
    //
    // This can happen if an old Firebase account was
    // created before Firestore profile saving was added.
    // Create the missing document automatically.
    // -----------------------------------------------------

    const recoveredUser = {
      uid: firebaseUser.uid,

      name:
        firebaseUser.displayName ||
        "",

      email:
        firebaseUser.email ||
        "",

      phone: "",

      role: "user",

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    };

    await setDoc(
      userRef,
      recoveredUser,
      {
        merge: true,
      }
    );

    return {
      uid: recoveredUser.uid,
      name: recoveredUser.name,
      email: recoveredUser.email,
      phone: recoveredUser.phone,
      role: recoveredUser.role,
    };

  } catch (error) {
    console.error(
      "Could not load Firestore user:",
      error
    );

    // -----------------------------------------------------
    // AUTH USER STILL EXISTS EVEN IF FIRESTORE FAILS
    // -----------------------------------------------------

    return {
      uid: firebaseUser.uid,

      name:
        firebaseUser.displayName ||
        "",

      email:
        firebaseUser.email ||
        "",

      phone: "",

      role: "user",
    };
  }
};

// =========================================================
// LOGOUT
// =========================================================

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(
      "Firebase logout error:",
      error
    );

    throw convertFirebaseError(error);
  }
};

// =========================================================
// AUTH STATE LISTENER
// =========================================================
//
// IMPORTANT:
// We DO NOT call loginUser() here.
//
// Firebase already knows whether the user is logged in.
// We only retrieve the Firestore profile.
// =========================================================

export const listenToAuth = (
  callback
) => {
  return onAuthStateChanged(
    auth,
    callback
  );
};

// =========================================================
// FIREBASE ERROR CONVERTER
// =========================================================

const convertFirebaseError = (
  error
) => {
  const code =
    error?.code || "";

  switch (code) {

    case "auth/invalid-email":
      return new Error(
        "Please enter a valid email address."
      );

    case "auth/user-not-found":
      return new Error(
        "No account was found with this email."
      );

    case "auth/wrong-password":
      return new Error(
        "Incorrect password."
      );

    case "auth/invalid-credential":
      return new Error(
        "Incorrect email or password."
      );

    case "auth/email-already-in-use":
      return new Error(
        "An account with this email already exists."
      );

    case "auth/weak-password":
      return new Error(
        "Password is too weak. Please use at least 6 characters."
      );

    case "auth/too-many-requests":
      return new Error(
        "Too many login attempts. Please wait a while and try again."
      );

    case "auth/network-request-failed":
      return new Error(
        "Network error. Please check your internet connection."
      );

    case "permission-denied":
      return new Error(
        "Firebase permission denied. Please check your Firestore security rules."
      );

    default:
      return new Error(
        error?.message ||
        "Firebase authentication failed."
      );
  }
};
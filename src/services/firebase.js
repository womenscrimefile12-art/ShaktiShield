import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCKa9GhknMDjnifJgeLKXyS3jMkZSk-Kk",
  authDomain: "shaktishield-30830.firebaseapp.com",
  projectId: "shaktishield-30830",
  storageBucket: "shaktishield-30830.firebasestorage.app",
  messagingSenderId: "851305362566",
  appId: "1:851305362566:web:d82cf148624db290288d07",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
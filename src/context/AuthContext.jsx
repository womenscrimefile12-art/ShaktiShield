import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * =====================================================
   * CHECK FIREBASE LOGIN STATE
   * =====================================================
   */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);
            localStorage.removeItem("shaktishield_user");
            localStorage.removeItem("shaktishield_token");
            setLoading(false);
            return;
          }

          /*
           * Get user's profile from Firestore
           */

          const userRef = doc(
            db,
            "users",
            firebaseUser.uid
          );

          const userSnap = await getDoc(userRef);

          let userData;

          if (userSnap.exists()) {
            userData = {
              _id: firebaseUser.uid,
              ...userSnap.data(),
              email: firebaseUser.email,
            };
          } else {
            /*
             * Fallback if Authentication user exists
             * but Firestore profile doesn't.
             */

            userData = {
              _id: firebaseUser.uid,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "ShaktiShield User",

              email: firebaseUser.email || "",

              phone: "",

              role: "user",
            };

            await setDoc(
              userRef,
              {
                name: userData.name,
                email: userData.email,
                phone: "",
                role: "user",
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          }

          setUser(userData);

          /*
           * Keep localStorage temporarily because
           * other existing ShaktiShield features
           * still use it.
           */

          localStorage.setItem(
            "shaktishield_user",
            JSON.stringify(userData)
          );

          const token = await firebaseUser.getIdToken();

          localStorage.setItem(
            "shaktishield_token",
            token
          );
        } catch (error) {
          console.error(
            "Firebase authentication state error:",
            error
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * =====================================================
   * LOGIN
   * =====================================================
   */

  const login = async (email, password) => {
    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const firebaseUser = credential.user;

      /*
       * Get Firestore profile
       */

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userSnap = await getDoc(userRef);

      let userData;

      if (userSnap.exists()) {
        userData = {
          _id: firebaseUser.uid,
          ...userSnap.data(),
          email: firebaseUser.email,
        };
      } else {
        userData = {
          _id: firebaseUser.uid,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "ShaktiShield User",
          email: firebaseUser.email || "",
          phone: "",
          role: "user",
        };

        await setDoc(
          userRef,
          {
            name: userData.name,
            email: userData.email,
            phone: "",
            role: "user",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setUser(userData);

      localStorage.setItem(
        "shaktishield_user",
        JSON.stringify(userData)
      );

      const token =
        await firebaseUser.getIdToken();

      localStorage.setItem(
        "shaktishield_token",
        token
      );

      return userData;
    } catch (error) {
      console.error("Firebase login error:", error);

      /*
       * Convert Firebase errors into messages
       * your existing Login.jsx can display.
       */

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        throw new Error(
          "Invalid email or password."
        );
      }

      if (
        error.code ===
        "auth/user-not-found"
      ) {
        throw new Error(
          "No account exists with this email."
        );
      }

      if (
        error.code ===
        "auth/wrong-password"
      ) {
        throw new Error(
          "Incorrect password."
        );
      }

      if (
        error.code ===
        "auth/too-many-requests"
      ) {
        throw new Error(
          "Too many login attempts. Please try again later."
        );
      }

      throw new Error(
        error.message ||
          "Unable to sign in."
      );
    }
  };

  /*
   * =====================================================
   * REGISTER
   * =====================================================
   */

  const register = async (formData) => {
    try {
      const {
        name,
        email,
        password,
        phone = "",
      } = formData;

      if (!name || !email || !password) {
        throw new Error(
          "Name, email and password are required."
        );
      }

      /*
       * Create Firebase Authentication account
       */

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const firebaseUser =
        credential.user;

      /*
       * Create user profile in Firestore
       */

      const userData = {
        _id: firebaseUser.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "user",
      };

      await setDoc(
        doc(
          db,
          "users",
          firebaseUser.uid
        ),
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: "user",
          createdAt: serverTimestamp(),
        }
      );

      /*
       * Keep existing ShaktiShield frontend
       * compatible with localStorage.
       */

      setUser(userData);

      localStorage.setItem(
        "shaktishield_user",
        JSON.stringify(userData)
      );

      const token =
        await firebaseUser.getIdToken();

      localStorage.setItem(
        "shaktishield_token",
        token
      );

      return userData;
    } catch (error) {
      console.error(
        "Firebase registration error:",
        error
      );

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        throw new Error(
          "An account with this email already exists."
        );
      }

      if (
        error.code ===
        "auth/weak-password"
      ) {
        throw new Error(
          "Password should be at least 6 characters."
        );
      }

      if (
        error.code ===
        "auth/invalid-email"
      ) {
        throw new Error(
          "Please enter a valid email address."
        );
      }

      throw new Error(
        error.message ||
          "Unable to create your account."
      );
    }
  };

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    localStorage.removeItem(
      "shaktishield_token"
    );

    localStorage.removeItem(
      "shaktishield_user"
    );

    setUser(null);
  };

  /*
   * =====================================================
   * ADMIN CHECK
   * =====================================================
   */

  const isAdmin =
    user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};
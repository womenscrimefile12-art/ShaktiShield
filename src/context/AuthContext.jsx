// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  logoutUser,
  listenToAuth,
  getUserData,
} from "../services/firebaseAuth";

import { auth } from "../services/firebase";

const AuthContext =
  createContext(null);

// =========================================================
// AUTH PROVIDER
// =========================================================

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =======================================================
  // FIREBASE AUTH STATE
  // =======================================================

  useEffect(() => {

    let mounted = true;

    const unsubscribe =
      listenToAuth(
        async (firebaseUser) => {

          if (!mounted) {
            return;
          }

          // ------------------------------------------------
          // USER IS LOGGED OUT
          // ------------------------------------------------

          if (!firebaseUser) {

            setUser(null);
            setLoading(false);

            return;
          }

          // ------------------------------------------------
          // USER IS LOGGED IN
          //
          // Do NOT login again.
          // Just retrieve Firestore profile.
          // ------------------------------------------------

          try {

            const userData =
              await getUserData(
                firebaseUser
              );

            if (!mounted) {
              return;
            }

            setUser(userData);

          } catch (error) {

            console.error(
              "Could not restore Firebase user:",
              error
            );

            if (!mounted) {
              return;
            }

            // ------------------------------------------------
            // Even if Firestore fails, Firebase Auth is valid.
            // Keep the authenticated user available.
            // ------------------------------------------------

            setUser({
              uid:
                firebaseUser.uid,

              name:
                firebaseUser.displayName ||
                "",

              email:
                firebaseUser.email ||
                "",

              phone: "",

              role: "user",
            });

          } finally {

            if (mounted) {
              setLoading(false);
            }

          }
        }
      );

    // ------------------------------------------------------
    // CLEANUP
    // ------------------------------------------------------

    return () => {

      mounted = false;

      unsubscribe();

    };

  }, []);

  // =======================================================
  // LOGIN
  // =======================================================

  const login = async (
    email,
    password
  ) => {

    const userData =
      await loginUser(
        email,
        password
      );

    setUser(userData);

    return userData;
  };

  // =======================================================
  // REGISTER
  // =======================================================

  const register = async (
    formData
  ) => {

    const userData =
      await registerUser(
        formData
      );

    setUser(userData);

    return userData;
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const logout = async () => {

    await logoutUser();

    setUser(null);
  };

  // =======================================================
  // ADMIN
  // =======================================================

  const isAdmin =
    user?.role === "admin";

  // =======================================================
  // CONTEXT
  // =======================================================

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

// =========================================================
// USE AUTH
// =========================================================

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
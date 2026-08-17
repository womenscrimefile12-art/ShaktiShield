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
} from "../services/firebaseAuth";

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // FIREBASE AUTH LISTENER
  // ==========================================

  useEffect(() => {

    const unsubscribe = listenToAuth(
      async (firebaseUser) => {

        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {

          const loggedUser = await loginUser(
            firebaseUser.email,
            ""
          );

          setUser(loggedUser);

        } catch {

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: "user",
          });

        }

        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, []);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {

    const userData = await loginUser(
      email,
      password
    );

    setUser(userData);

    return userData;
  };


  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (formData) => {

    const userData =
      await registerUser(formData);

    setUser(userData);

    return userData;
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {

    await logoutUser();

    setUser(null);
  };


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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import AuthContext from "./AuthContext.jsx";
import { app } from "../firebase";

const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user || { uid: null });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

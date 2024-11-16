import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { app } from "../firebase";

const auth = getAuth(app);

export type UserStateType = User | { uid: null } | null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<UserStateType>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user || { uid: null });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

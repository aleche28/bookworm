import { createContext } from "react";
import { UserStateType } from "./AuthProvider";

const AuthContext = createContext({ user: null as UserStateType });

export { AuthContext };

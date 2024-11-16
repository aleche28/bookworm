import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { app, db } from "../firebase";
import { getErrorMessage } from "../utils/errorHelpers";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

type ResponseType = {
  success: boolean,
  error: string
}

const signUp = async (email: string, password: string): Promise<ResponseType> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
    });
    return { success: true, error: "" };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};

const login = async (email: string, password: string): Promise<ResponseType> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, error: "" };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};

const googleLogin = async (): Promise<ResponseType> => {
  try {
    await signInWithPopup(auth, provider);
    return { success: true, error: "" };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};

const logout = async (): Promise<ResponseType> => {
  try {
    await signOut(auth);
    return { success: true, error: "" };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export { signUp, login, googleLogin, logout };

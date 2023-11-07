import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { app, db } from "../firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
    });
    return true;
  } catch (error) {
    return { error: error.message };
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    return { error: error.message };
  }
};

/* DOC: https://firebase.google.com/docs/auth/web/google-signin?authuser=0 */
const googleLogin = async () => {
  try {
    // TO-DO: change this to signInWithRedirect
    await signInWithPopup(auth, provider);
    return true;
  } catch (error) {
    return { error: error.message };
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return false;
  }
};

export { signUp, login, googleLogin, logout };

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

// SIGN UP
export const registerUser = async (
  email: string,
  password: string,
  role: string
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    email,
    role,
    createdAt: serverTimestamp(),
  });

  return res.user;
};

// ✅ LOGIN (THIS WAS MISSING)
export const loginUser = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};

// LOGOUT (optional)
export const logoutUser = async () => {
  await signOut(auth);
};

import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const savingsRef = collection(db, "savings");

export const addSavings = async (data: {
  memberId: string;
  amount: number;
  month: string;
}) => {
  await addDoc(savingsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getMemberSavings = async (memberId: string) => {
  const q = query(savingsRef, where("memberId", "==", memberId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

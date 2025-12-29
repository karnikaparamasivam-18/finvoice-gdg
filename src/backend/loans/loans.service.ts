import {
  addDoc,
  collection,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const loansRef = collection(db, "loans");

export const issueLoan = async (data: {
  memberId: string;
  amount: number;
  interest: number;
  duration: number;
}) => {
  await addDoc(loansRef, {
    ...data,
    status: "ACTIVE",
    issuedAt: serverTimestamp(),
  });
};

export const closeLoan = async (loanId: string) => {
  await updateDoc(doc(db, "loans", loanId), {
    status: "CLOSED",
  });
};

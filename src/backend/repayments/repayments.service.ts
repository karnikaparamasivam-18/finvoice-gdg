import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const repaymentRef = collection(db, "repayments");

export const addRepayment = async (data: {
  loanId: string;
  amount: number;
}) => {
  await addDoc(repaymentRef, {
    ...data,
    paidAt: serverTimestamp(),
  });
};

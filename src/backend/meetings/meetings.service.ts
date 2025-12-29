import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const meetingsRef = collection(db, "meetings");

export const scheduleMeeting = async (date: string, agenda: string) => {
  await addDoc(meetingsRef, {
    date,
    agenda,
    createdAt: serverTimestamp(),
  });
};

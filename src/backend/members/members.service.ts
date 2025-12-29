import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { Member } from "@/store/appStore";

export const addMemberToGroup = async (
  groupId: string,
  member: Member
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const memberRef = doc(
    collection(db, "groups", groupId, "members"),
    member.id
  );

  await setDoc(memberRef, {
    name: member.name,
    address: member.address,
    balance: member.balance,
    loan: member.loan,
    loanInterestRate: member.loanInterestRate,
    createdAt: serverTimestamp(),
  });
};

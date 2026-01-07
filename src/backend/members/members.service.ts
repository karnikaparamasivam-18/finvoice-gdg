import { collection, doc, setDoc, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
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
    loanRepayments: member.loanRepayments,
    createdAt: serverTimestamp(),
  });
};

// ✅ GET ALL MEMBERS FROM FIRESTORE
export const getMembersFromGroup = async (groupId: string): Promise<Member[]> => {
  const membersRef = collection(db, "groups", groupId, "members");
  const snapshot = await getDocs(membersRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      address: data.address,
      balance: data.balance || 0,
      loan: data.loan || 0,
      loanInterestRate: data.loanInterestRate || 0,
      loanRepayments: data.loanRepayments || [],
    };
  });
};

// ✅ UPDATE MEMBER BALANCE IN FIRESTORE
export const updateMemberBalanceInFirestore = async (
  groupId: string,
  memberId: string,
  newBalance: number
) => {
  const memberRef = doc(db, "groups", groupId, "members", memberId);
  await updateDoc(memberRef, {
    balance: newBalance,
    updatedAt: serverTimestamp(),
  });
};

// ✅ UPDATE MEMBER LOAN IN FIRESTORE
export const updateMemberLoanInFirestore = async (
  groupId: string,
  memberId: string,
  newLoan: number,
  interestRate: number
) => {
  const memberRef = doc(db, "groups", groupId, "members", memberId);
  await updateDoc(memberRef, {
    loan: newLoan,
    loanInterestRate: interestRate,
    updatedAt: serverTimestamp(),
  });
};

// ✅ UPDATE MEMBER LOAN REPAYMENT IN FIRESTORE
export const recordLoanRepaymentInFirestore = async (
  groupId: string,
  memberId: string,
  repaymentAmount: number,
  newLoanAmount: number,
  repayments: { date: string; amount: number }[]
) => {
  const memberRef = doc(db, "groups", groupId, "members", memberId);
  await updateDoc(memberRef, {
    loan: newLoanAmount,
    loanRepayments: repayments,
    updatedAt: serverTimestamp(),
  });
};

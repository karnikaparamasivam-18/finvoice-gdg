import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getDashboardStats = async () => {
  const members = await getDocs(collection(db, "members"));
  const loans = await getDocs(collection(db, "loans"));
  const savings = await getDocs(collection(db, "savings"));

  return {
    totalMembers: members.size,
    totalLoans: loans.size,
    totalSavings: savings.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    ),
  };
};

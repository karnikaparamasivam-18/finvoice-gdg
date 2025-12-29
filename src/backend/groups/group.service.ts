import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { GroupInfo } from "@/store/appStore";

export const createGroup = async (group: GroupInfo) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const groupRef = doc(db, "groups", group.id);

  await setDoc(groupRef, {
    name: group.name,
    memberCount: group.memberCount,
    meetingFrequency: group.meetingFrequency,
    firstMeetingDate: group.firstMeetingDate,
    contributionAmount: group.contributionAmount,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });
};

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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

// ✅ GET GROUP DATA FROM FIRESTORE
export const getGroup = async (groupId: string): Promise<GroupInfo | null> => {
  const groupRef = doc(db, "groups", groupId);
  const snapshot = await getDoc(groupRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: groupId,
    name: data.name,
    memberCount: data.memberCount,
    meetingFrequency: data.meetingFrequency,
    firstMeetingDate: data.firstMeetingDate,
    contributionAmount: data.contributionAmount,
  };
};

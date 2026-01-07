import { db } from '@/firebase/firebase';
import { doc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

/**
 * Delete a group and all its members from Firestore
 * This is used when user wants to reset/delete all their data
 */
export const deleteGroupAndMembers = async (groupId: string): Promise<void> => {
    try {
        const batch = writeBatch(db);

        // 1. Delete all members in the group
        const membersRef = collection(db, 'groups', groupId, 'members');
        const membersSnapshot = await getDocs(membersRef);

        membersSnapshot.forEach((memberDoc) => {
            batch.delete(memberDoc.ref);
        });

        // 2. Delete the group document itself
        const groupRef = doc(db, 'groups', groupId);
        batch.delete(groupRef);

        // 3. Commit all deletions
        await batch.commit();

        console.log(`✅ Successfully deleted group ${groupId} and all its members from Firestore`);
    } catch (error) {
        console.error('Error deleting group and members:', error);
        throw error;
    }
};

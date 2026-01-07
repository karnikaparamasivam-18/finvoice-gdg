import { useEffect, useState } from 'react';
import { useAuth } from '@/backend/auth/useAuth';
import { useAppStore } from '@/store/appStore';
import { getGroup } from '@/backend/groups/group.service';
import { getMembersFromGroup } from '@/backend/members/members.service';

// ✅ HOOK TO LOAD DATA FROM FIRESTORE ON STARTUP
export const useLoadFromFirestore = () => {
  const { user, loading: authLoading } = useAuth();
  const groupInfo = useAppStore((state) => state.groupInfo);
  const setGroupInfo = useAppStore((state) => state.setGroupInfo);
  const setMembers = useAppStore((state) => state.setMembers);
  const setTotalBalance = useAppStore((state) => state.setTotalBalance);
  const setTotalLoanBalance = useAppStore((state) => state.setTotalLoanBalance);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;

    // ✅ Only load once per session
    if (hasLoaded) return;

    // ✅ Don't load if groupInfo already exists (from Zustand persistence)
    if (groupInfo) {
      setHasLoaded(true);
      return;
    }

    const loadData = async () => {
      try {
        const savedGroupId = localStorage.getItem('groupId');

        if (savedGroupId) {
          console.log('Loading group data from Firestore...', savedGroupId);
          const group = await getGroup(savedGroupId);

          if (group) {
            setGroupInfo(group);
            localStorage.setItem('groupId', group.id);

            // ✅ GET ALL MEMBERS FROM FIRESTORE
            const firestoreMembers = await getMembersFromGroup(group.id);
            if (firestoreMembers && firestoreMembers.length > 0) {
              console.log(`✅ Loaded ${firestoreMembers.length} members from Firestore`);
              setMembers(firestoreMembers);

              // ✅ CALCULATE TOTALS FROM ALL MEMBERS
              const totalBalance = firestoreMembers.reduce((sum, m) => sum + (m.balance || 0), 0);
              const totalLoanBalance = firestoreMembers.reduce((sum, m) => sum + (m.loan || 0), 0);

              setTotalBalance(totalBalance);
              setTotalLoanBalance(totalLoanBalance);

              console.log(`✅ Total Balance: ₹${totalBalance}, Total Loans: ₹${totalLoanBalance}`);
            } else {
              console.log('ℹ️ No members found in Firestore');
              setMembers([]);
              setTotalBalance(0);
              setTotalLoanBalance(0);
            }

            setHasLoaded(true);
          } else {
            console.log('⚠️ Group not found in Firestore, clearing localStorage');
            localStorage.removeItem('groupId');
          }
        } else {
          console.log('ℹ️ No groupId in localStorage');
        }
      } catch (error) {
        console.error('❌ Failed to load data from Firestore:', error);
      }
    };

    loadData();
  }, [authLoading, user, hasLoaded, groupInfo, setGroupInfo, setMembers, setTotalBalance, setTotalLoanBalance]);
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/backend/auth/useAuth';
import { useAppStore } from '@/store/appStore';

/**
 * Smart routing hook that redirects users based on:
 * 1. Auth state (logged in or not)
 * 2. Setup progress (new user or returning)
 * 3. Existing data in Firestore
 */
export const useSmartRoute = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const language = useAppStore((state) => state.language);
  const groupInfo = useAppStore((state) => state.groupInfo);
  const members = useAppStore((state) => state.members);
  const setupComplete = useAppStore((state) => state.setupComplete);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    // NOT AUTHENTICATED: Redirect to auth page
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    // AUTHENTICATED USER
    // Check if user has existing group (returning user)
    const hasExistingGroup = !!groupInfo;

    if (hasExistingGroup) {
      // ✅ FIX: Check if user has added members
      if (members.length === 0) {
        // User created group but hasn't added members yet
        navigate('/members', { replace: true });
      } else {
        // ✅ RETURNING USER with members: Redirect to Dashboard
        navigate('/dashboard', { replace: true });
      }
    } else {
      // ✅ NEW USER: Redirect to Welcome (language selection)
      if (language) {
        // Language already selected, go to setup
        navigate('/setup', { replace: true });
      } else {
        // No language selected, go to welcome
        navigate('/welcome', { replace: true });
      }
    }
  }, [authLoading, user, groupInfo, language, members, navigate]);
};

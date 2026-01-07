import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, Language } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Settings, Globe, Users, Calendar, RefreshCcw, Coins, LogOut } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/backend/auth/auth.service';
import { deleteGroupAndMembers } from '@/backend/groups/deleteGroup.service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export const SettingsPage = () => {
  const language = useAppStore((state) => state.language);
  const groupInfo = useAppStore((state) => state.groupInfo);
  const members = useAppStore((state) => state.members);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const resetApp = useAppStore((state) => state.resetApp);
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  // ✅ RESET HANDLER - Deletes ALL data from Firestore AND local storage
  const handleReset = async () => {
    if (!groupInfo) {
      // No group to delete, just clear local state
      resetApp();
      localStorage.removeItem('finvoice-storage');
      localStorage.removeItem('groupId');
      localStorage.removeItem('lang');
      navigate('/');
      return;
    }

    setIsResetting(true);
    try {
      // 1. Delete from Firestore (group + all members)
      await deleteGroupAndMembers(groupInfo.id);

      // 2. Clear local state
      resetApp();

      // 3. Clear ALL localStorage
      localStorage.removeItem('finvoice-storage');
      localStorage.removeItem('groupId');
      localStorage.removeItem('lang');

      // 4. Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Failed to reset app:', error);
      alert('Failed to delete data. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  // ✅ LOGOUT HANDLER - Only logs out, preserves data in Firestore
  const handleLogout = async () => {
    try {
      await logoutUser();
      // ✅ Clear Zustand state
      resetApp();
      // ✅ IMPORTANT: Clear Zustand persisted storage so old data doesn't restore
      localStorage.removeItem('finvoice-storage');
      // Keep groupId and language for next login
      // DON'T remove groupId - it's needed to reload data on next login
      // DON'T remove lang - keep language preference
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t(language, 'settings')}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your app preferences
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Group Info */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4" />
            Group Information
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-muted-foreground">Group Name</span>
              <span className="font-semibold text-foreground">{groupInfo?.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-muted-foreground">Members</span>
              <span className="font-semibold text-foreground">{members.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Meeting Frequency
              </span>
              <span className="font-semibold text-foreground capitalize">
                {groupInfo?.meetingFrequency}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-muted-foreground flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Contribution
              </span>
              <span className="font-semibold text-foreground">
                ₹{groupInfo?.contributionAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language / மொழி / भाषा / ഭാഷ
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-xl border-2 transition-all ${language === lang.code
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-muted hover:border-primary/50'
                  }`}
              >
                <span className="block text-lg font-bold text-foreground">
                  {lang.nativeName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            {t(language, 'logout')}
          </h3>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out and returned to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Reset App */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Reset Application
          </h3>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isResetting}>
                <RefreshCcw className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                {isResetting ? 'Deleting...' : 'Reset All Data'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all group data, member information, and transaction history.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-2xl font-bold text-gradient mb-1">FinVoice</p>
          <p className="text-sm text-muted-foreground">
            Empowering Women's Self Help Groups
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Version 1.0.0
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

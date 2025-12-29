import { useNavigate } from 'react-router-dom';
import { useAppStore, Language } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Settings, Globe, Users, Calendar, RefreshCcw, Coins } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { Button } from '@/components/ui/button';
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

  const handleReset = () => {
    resetApp();
    navigate('/');
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
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === lang.code
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

        {/* Reset App */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t(language, 'logout')}
          </h3>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset Application
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

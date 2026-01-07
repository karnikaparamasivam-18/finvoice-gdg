import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Mic, MicOff, Wallet, Users, TrendingUp, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BottomNavigation } from './BottomNavigation';
import { ManualEntryForms } from './ManualEntryForms';
import { TransactionHistory } from './TransactionHistory';
import {
  updateMemberBalanceInFirestore,
  updateMemberLoanInFirestore,
  recordLoanRepaymentInFirestore
} from '@/backend/members/members.service';
import '@/types/speech.d.ts';

export const Dashboard = () => {
  const language = useAppStore((state) => state.language);
  const groupInfo = useAppStore((state) => state.groupInfo);
  const members = useAppStore((state) => state.members);
  const totalBalance = useAppStore((state) => state.totalBalance);
  const updateMemberBalance = useAppStore((state) => state.updateMemberBalance);
  const addLoanByName = useAppStore((state) => state.addLoanByName);
  const addLoanRepaymentByName = useAppStore((state) => state.addLoanRepaymentByName);
  const updateMemberBalanceByName = useAppStore((state) => state.updateMemberBalanceByName);
  const addTransaction = useAppStore((state) => state.addTransaction); // ✅ NEW

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;

      // Set language based on app language
      const langMap = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN', ml: 'ml-IN' };
      recognitionInstance.lang = langMap[language || 'en'];

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        setTranscript(text);

        if (result.isFinal) {
          processVoiceCommand(text);
        }
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      recognitionInstance.onerror = () => {
        setIsRecording(false);
        toast({
          title: 'Voice recognition error',
          description: 'Please try again',
          variant: 'destructive',
        });
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  const processVoiceCommand = useCallback(async (text: string) => {
    const lowerText = text.toLowerCase();

    // Find member name in the command
    const memberNames = members.map(m => m.name.toLowerCase());
    let foundMember = '';
    let foundMemberId = '';

    for (let i = 0; i < memberNames.length; i++) {
      if (lowerText.includes(memberNames[i])) {
        foundMember = members[i].name;
        foundMemberId = members[i].id;
        break;
      }
    }

    // Extract amount from the command
    const amountMatch = lowerText.match(/(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[1]) : 0;

    if (!foundMember || !amount) {
      toast({
        title: 'Could not understand',
        description: 'Please try again with format: "Name add/loan/repayment amount"',
        variant: 'destructive',
      });
      return;
    }

    // Determine action
    if (lowerText.includes('loan') || lowerText.includes('கடன்') || lowerText.includes('कर्ज') || lowerText.includes('വായ്പ')) {
      addLoanByName(foundMember, amount, 12);
      // ✅ Sync to Firestore
      if (groupInfo) {
        await updateMemberLoanInFirestore(groupInfo.id, foundMemberId, amount, 12);
      }
      toast({
        title: `${t(language, 'loanTaken')} ${foundMember}`,
        description: `₹${amount.toLocaleString('en-IN')}`,
      });
    } else if (lowerText.includes('repay') || lowerText.includes('return') || lowerText.includes('திருப்பி') || lowerText.includes('चुका') || lowerText.includes('തിരിച്ച')) {
      addLoanRepaymentByName(foundMember, amount);
      // ✅ Get member and sync to Firestore
      const member = members.find(m => m.id === foundMemberId);
      if (member && groupInfo) {
        const repaymentAmount = Math.min(amount, member.loan);
        const newLoanAmount = member.loan - repaymentAmount;
        await recordLoanRepaymentInFirestore(
          groupInfo.id,
          foundMemberId,
          repaymentAmount,
          newLoanAmount,
          member.loanRepayments
        );
      }
      toast({
        title: `${t(language, 'repayment')} ${foundMember}`,
        description: `₹${amount.toLocaleString('en-IN')}`,
      });
    } else if (lowerText.includes('add') || lowerText.includes('சேர்') || lowerText.includes('जोड़') || lowerText.includes('ചേർ')) {
      updateMemberBalanceByName(foundMember, amount);
      // ✅ Sync to Firestore
      const member = members.find(m => m.id === foundMemberId);
      if (member && groupInfo) {
        await updateMemberBalanceInFirestore(groupInfo.id, foundMemberId, member.balance + amount);
      }
      toast({
        title: `${t(language, 'updated')}!`,
        description: `${foundMember} ${t(language, 'added')} ₹${amount.toLocaleString('en-IN')}`,
      });
    } else {
      // Default to adding balance
      updateMemberBalanceByName(foundMember, amount);
      // ✅ Sync to Firestore
      const member = members.find(m => m.id === foundMemberId);
      if (member && groupInfo) {
        await updateMemberBalanceInFirestore(groupInfo.id, foundMemberId, member.balance + amount);
      }
      toast({
        title: `${t(language, 'updated')}!`,
        description: `${foundMember} ${t(language, 'added')} ₹${amount.toLocaleString('en-IN')}`,
      });
    }

    setTranscript('');
  }, [members, language, updateMemberBalanceByName, addLoanByName, addLoanRepaymentByName, groupInfo]);

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: 'Voice not supported',
        description: 'Your browser does not support voice recognition',
        variant: 'destructive',
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const totalLoans = members.reduce((sum, m) => sum + m.loan, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary p-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-primary-foreground mb-1">
            {groupInfo?.name}
          </h1>
          <p className="text-primary-foreground/80 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            {members.length} {t(language, 'members')}
          </p>

          {/* Contribution badge */}
          <div className="absolute top-0 right-0 bg-primary-foreground/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-xs text-primary-foreground/80">{t(language, 'contribution')}</span>
            <p className="font-bold text-primary-foreground">
              ₹{groupInfo?.contributionAmount?.toLocaleString('en-IN')}/{groupInfo?.meetingFrequency === 'weekly' ? 'wk' : 'mo'}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="px-4 -mt-14 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Balance */}
          <div className="bg-card p-5 rounded-2xl shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-success-light rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{t(language, 'totalBalance')}</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{totalBalance.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Total Loans */}
          <div className="bg-card p-5 rounded-2xl shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-warning-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{t(language, 'totalOutstanding')}</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{totalLoans.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Voice Command Section */}
      <div className="px-4 mt-8">
        <div className="bg-card p-6 rounded-2xl shadow-card border border-border">
          <div className="text-center mb-6">
            <h3 className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              {t(language, 'speakCommand')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t(language, 'exampleCommands')}
            </p>
          </div>

          {/* Recording Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                ? 'bg-destructive animate-recording shadow-lg'
                : 'gradient-primary hover:scale-105 shadow-glow'
                }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-destructive-foreground" />
              ) : (
                <Mic className="w-8 h-8 text-primary-foreground" />
              )}
            </button>
          </div>

          <p className="text-center text-sm font-medium text-foreground">
            {isRecording ? t(language, 'recording') : t(language, 'tapToSpeak')}
          </p>

          {/* Transcript */}
          {transcript && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-foreground text-center italic">
                "{transcript}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Recent Activity
        </h3>
        <div className="space-y-2">
          {members.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary-foreground">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(language, 'balance')}: ₹{member.balance.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              {member.loan > 0 && (
                <span className="text-xs font-medium text-warning bg-warning-light px-2 py-1 rounded-full">
                  {t(language, 'loan')}: ₹{member.loan.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✨ NEW: Manual Entry Forms */}
      <ManualEntryForms />

      {/* ✨ NEW: Transaction History */}
      <TransactionHistory />

      <BottomNavigation />
    </div>
  );
};


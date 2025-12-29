import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'ta' | 'hi' | 'ml';
export type MeetingFrequency = 'weekly' | 'monthly';

export interface Member {
  id: string;
  name: string;
  address: string;
  balance: number;
  loan: number;
  loanInterestRate: number;
  loanRepayments: { date: string; amount: number }[];
}

export interface GroupInfo {
  id: string; // ✅ REQUIRED for Firestore doc ID
  name: string;
  memberCount: number;
  meetingFrequency: MeetingFrequency;
  firstMeetingDate: string;
  contributionAmount: number;
}



interface AppState {
  language: Language | null;
  groupInfo: GroupInfo | null;
  members: Member[];
  totalBalance: number;
  totalLoanBalance: number;
  setupComplete: boolean;

  // Actions
  setLanguage: (lang: Language) => void;
  setGroupInfo: (info: GroupInfo) => void;
  addMember: (
  member: Omit<Member, 'balance' | 'loan' | 'loanInterestRate' | 'loanRepayments'>
  ) => void;

  updateMemberBalance: (name: string, amount: number) => void;
  addLoan: (name: string, amount: number, interestRate: number) => void;
  addLoanRepayment: (name: string, amount: number) => void;
  completeSetup: () => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: null,
      groupInfo: null,
      members: [],
      totalBalance: 0,
      totalLoanBalance: 0,
      setupComplete: false,

      setLanguage: (lang) => set({ language: lang }),

      setGroupInfo: (info) => set({ groupInfo: info }),

      addMember: (member) =>
  set((state) => ({
    members: [
      ...state.members,
      {
        ...member,
        balance: 0,
        loan: 0,
        loanInterestRate: 0,
        loanRepayments: [],
      },
    ],
  })),


      // ✅ CONTRIBUTION
      updateMemberBalance: (memberName, amount) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.name.toLowerCase() === memberName.toLowerCase()
              ? { ...m, balance: m.balance + amount }
              : m
          ),
          totalBalance: state.totalBalance + amount,
        })),

      // ✅ LOAN TAKEN
      addLoan: (memberName, amount, interestRate) =>
        set((state) => {
          if (state.totalBalance < amount) {
            return state; // block loan
          }

          return {
            members: state.members.map((m) =>
              m.name.toLowerCase() === memberName.toLowerCase()
                ? {
                    ...m,
                    loan: m.loan + amount,
                    loanInterestRate: interestRate,
                  }
                : m
            ),
            totalBalance: state.totalBalance - amount,
            totalLoanBalance: state.totalLoanBalance + amount,
          };
        }),

      // ✅ LOAN REPAYMENT
      addLoanRepayment: (memberName, amount) =>
        set((state) => ({
          members: state.members.map((m) => {
            if (m.name.toLowerCase() !== memberName.toLowerCase()) {
              return m;
            }

            const repaymentAmount = Math.min(amount, m.loan);

            return {
              ...m,
              loan: m.loan - repaymentAmount,
              loanRepayments: [
                ...m.loanRepayments,
                {
                  amount: repaymentAmount,
                  date: new Date().toISOString(),
                },
              ],
            };
          }),
          totalBalance: state.totalBalance + amount,
          totalLoanBalance: Math.max(0, state.totalLoanBalance - amount),
        })),

      completeSetup: () => set({ setupComplete: true }),

      resetApp: () =>
        set({
          language: null,
          groupInfo: null,
          members: [],
          totalBalance: 0,
          totalLoanBalance: 0,
          setupComplete: false,
        }),
    }),
    {
      name: 'finvoice-storage',
    }
  )
);

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
  defaultLoanInterestRate?: number; // ✅ Optional default interest rate for loans (defaults to 12%)
}

export type TransactionType = 'balance' | 'loan' | 'repayment';

export interface Transaction {
  id: string;
  type: TransactionType;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate?: number; // for loans
  timestamp: string;
  description?: string;
}



interface AppState {
  language: Language | null;
  groupInfo: GroupInfo | null;
  members: Member[];
  totalBalance: number;
  totalLoanBalance: number;
  setupComplete: boolean;
  transactions: Transaction[]; // ✅ NEW: Transaction history

  // Actions
  setLanguage: (lang: Language) => void;
  setGroupInfo: (info: GroupInfo) => void;
  setMembers: (members: Member[]) => void;  // ✅ Load members from Firestore
  setTotalBalance: (balance: number) => void;  // ✅ Set total balance
  setTotalLoanBalance: (balance: number) => void;  // ✅ Set total loan balance
  addMember: (
    member: Omit<Member, 'balance' | 'loan' | 'loanInterestRate' | 'loanRepayments'>
  ) => void;

  updateMemberBalance: (memberId: string, amount: number) => void;  // ✅ Updated to use ID
  updateMemberBalanceByName: (name: string, amount: number) => void;  // ✅ Keep for voice commands
  addLoan: (memberId: string, amount: number, interestRate: number) => void;  // ✅ Updated to use ID
  addLoanByName: (name: string, amount: number, interestRate: number) => void;  // ✅ Keep for voice commands
  addLoanRepayment: (memberId: string, amount: number) => void;  // ✅ Updated to use ID
  addLoanRepaymentByName: (name: string, amount: number) => void;  // ✅ Keep for voice commands

  // ✅ NEW: Transaction management
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  editTransaction: (id: string, updates: Partial<Pick<Transaction, 'amount' | 'interestRate'>>) => void;
  deleteTransaction: (id: string) => void;

  completeSetup: () => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: null,
      groupInfo: null,
      members: [],
      totalBalance: 0,
      totalLoanBalance: 0,
      setupComplete: false,
      transactions: [], // ✅ NEW: Initialize empty transactions array

      setLanguage: (lang) => set({ language: lang }),

      setGroupInfo: (info) => set({ groupInfo: info }),

      // ✅ NEW: Load members from Firestore
      setMembers: (members) => set({ members }),

      // ✅ NEW: Set total balance
      setTotalBalance: (balance) => set({ totalBalance: balance }),

      // ✅ NEW: Set total loan balance
      setTotalLoanBalance: (balance) => set({ totalLoanBalance: balance }),

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

      // ✅ UPDATE BALANCE BY MEMBER ID (FOR FIRESTORE SYNC)
      updateMemberBalance: (memberId, amount) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId
              ? { ...m, balance: m.balance + amount }
              : m
          ),
          totalBalance: state.totalBalance + amount,
        })),

      // ✅ KEEP FOR VOICE COMMANDS (BY NAME)
      updateMemberBalanceByName: (memberName, amount) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.name.toLowerCase() === memberName.toLowerCase()
              ? { ...m, balance: m.balance + amount }
              : m
          ),
          totalBalance: state.totalBalance + amount,
        })),

      // ✅ LOAN TAKEN BY MEMBER ID (FOR FIRESTORE SYNC)
      addLoan: (memberId, amount, interestRate) =>
        set((state) => {
          const member = state.members.find(m => m.id === memberId);
          if (!member) return state;
          if (state.totalBalance < amount) {
            return state; // block loan
          }

          return {
            members: state.members.map((m) =>
              m.id === memberId
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

      // ✅ KEEP FOR VOICE COMMANDS (BY NAME)
      addLoanByName: (memberName, amount, interestRate) =>
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

      // ✅ LOAN REPAYMENT BY MEMBER ID (FOR FIRESTORE SYNC)
      addLoanRepayment: (memberId, amount) =>
        set((state) => ({
          members: state.members.map((m) => {
            if (m.id !== memberId) {
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

      // ✅ KEEP FOR VOICE COMMANDS (BY NAME)
      addLoanRepaymentByName: (memberName, amount) =>
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

      // ✅ NEW: Add transaction to history
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            },
            ...state.transactions,
          ].slice(0, 100), // Keep last 100 transactions
        })),

      // ✅ NEW: Edit transaction
      editTransaction: (id, updates) =>
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === id);
          if (!transaction) return state;

          const oldAmount = transaction.amount;
          const newAmount = updates.amount ?? oldAmount;
          const amountDiff = newAmount - oldAmount;

          // Update member data based on transaction type
          let updatedMembers = state.members;
          let updatedTotalBalance = state.totalBalance;
          let updatedTotalLoanBalance = state.totalLoanBalance;

          if (transaction.type === 'balance') {
            updatedMembers = state.members.map((m) =>
              m.id === transaction.memberId
                ? { ...m, balance: m.balance + amountDiff }
                : m
            );
            updatedTotalBalance = state.totalBalance + amountDiff;
          } else if (transaction.type === 'loan') {
            updatedMembers = state.members.map((m) =>
              m.id === transaction.memberId
                ? {
                  ...m,
                  loan: m.loan + amountDiff,
                  loanInterestRate: updates.interestRate ?? m.loanInterestRate,
                }
                : m
            );
            updatedTotalBalance = state.totalBalance - amountDiff;
            updatedTotalLoanBalance = state.totalLoanBalance + amountDiff;
          } else if (transaction.type === 'repayment') {
            updatedMembers = state.members.map((m) =>
              m.id === transaction.memberId
                ? { ...m, loan: m.loan - amountDiff }
                : m
            );
            updatedTotalBalance = state.totalBalance + amountDiff;
            updatedTotalLoanBalance = Math.max(0, state.totalLoanBalance - amountDiff);
          }

          return {
            members: updatedMembers,
            totalBalance: updatedTotalBalance,
            totalLoanBalance: updatedTotalLoanBalance,
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          };
        }),

      // ✅ NEW: Delete transaction (reverse it)
      deleteTransaction: (id) =>
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === id);
          if (!transaction) return state;

          // Reverse the transaction
          let updatedMembers = state.members;
          let updatedTotalBalance = state.totalBalance;
          let updatedTotalLoanBalance = state.totalLoanBalance;

          if (transaction.type === 'balance') {
            // Reverse balance addition
            updatedMembers = state.members.map((m) =>
              m.id === transaction.memberId
                ? { ...m, balance: m.balance - transaction.amount }
                : m
            );
            updatedTotalBalance = state.totalBalance - transaction.amount;
          } else if (transaction.type === 'loan') {
            // Reverse loan (remove loan, add back to balance)
            updatedMembers = state.members.map((m) =>
              m.id === transaction.memberId
                ? { ...m, loan: m.loan - transaction.amount }
                : m
            );
            updatedTotalBalance = state.totalBalance + transaction.amount;
            updatedTotalLoanBalance = Math.max(0, state.totalLoanBalance - transaction.amount);
          } else if (transaction.type === 'repayment') {
            // Reverse repayment (add back to loan, remove from balance)
            updatedMembers = state.members.map((m) =>
              m.id === transaction.memberId
                ? { ...m, loan: m.loan + transaction.amount }
                : m
            );
            updatedTotalBalance = state.totalBalance - transaction.amount;
            updatedTotalLoanBalance = state.totalLoanBalance + transaction.amount;
          }

          return {
            members: updatedMembers,
            totalBalance: updatedTotalBalance,
            totalLoanBalance: updatedTotalLoanBalance,
            transactions: state.transactions.filter((t) => t.id !== id),
          };
        }),

      completeSetup: () => set({ setupComplete: true }),

      resetApp: () =>
        set({
          language: null,
          groupInfo: null,
          members: [],
          totalBalance: 0,
          totalLoanBalance: 0,
          setupComplete: false,
          transactions: [],
        }),
    }),
    {
      name: 'finvoice-storage',
    }
  )
);

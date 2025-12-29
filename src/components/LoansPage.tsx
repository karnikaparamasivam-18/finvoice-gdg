import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { CreditCard, TrendingDown, Calendar, Percent, User } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

export const LoansPage = () => {
  const language = useAppStore((state) => state.language);
  const members = useAppStore((state) => state.members);

  const membersWithLoans = members.filter((m) => m.loan > 0);
  const totalOutstanding = membersWithLoans.reduce((sum, m) => sum + m.loan, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 gradient-warm rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t(language, 'loans')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(language, 'loanDetails')}
            </p>
          </div>
        </div>

        {/* Total Outstanding Card */}
        <div className="bg-warning-light p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium mb-1">
                {t(language, 'totalOutstanding')}
              </p>
              <p className="text-3xl font-bold text-foreground">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </p>
            </div>
            <TrendingDown className="w-10 h-10 text-warning" />
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="p-4">
        {membersWithLoans.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              {t(language, 'noLoans')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {membersWithLoans.map((member) => (
              <div
                key={member.id}
                className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden animate-fade-in"
              >
                {/* Member Header */}
                <div className="p-4 border-b border-border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">
                        {member.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {member.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {t(language, 'loanAmount')}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        ₹{member.loan.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-muted p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-accent" />
                        <span className="text-xs text-muted-foreground">
                          {t(language, 'interestRate')}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        {member.loanInterestRate}%
                      </p>
                    </div>
                  </div>

                  {/* Repayment History */}
                  {member.loanRepayments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {t(language, 'repaymentHistory')}
                      </h4>
                      <div className="space-y-2">
                        {member.loanRepayments.map((repayment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-success-light p-3 rounded-lg"
                          >
                            <span className="text-sm text-foreground">
                              {new Date(repayment.date).toLocaleDateString()}
                            </span>
                            <span className="font-semibold text-success">
                              +₹{repayment.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

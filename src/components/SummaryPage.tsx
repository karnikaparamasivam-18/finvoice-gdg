import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { FileText, Wallet, CreditCard, User, MapPin } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';

export const SummaryPage = () => {
  const language = useAppStore((state) => state.language);
  const groupInfo = useAppStore((state) => state.groupInfo);
  const members = useAppStore((state) => state.members);
  const totalBalance = useAppStore((state) => state.totalBalance);

  const totalLoans = members.reduce((sum, m) => sum + m.loan, 0);
  const totalContributions = members.reduce((sum, m) => sum + m.balance, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t(language, 'overallSummary')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {groupInfo?.name}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success-light p-3 rounded-xl text-center">
            <Wallet className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-xs text-muted-foreground mb-1">{t(language, 'totalBalance')}</p>
            <p className="font-bold text-foreground">₹{totalBalance.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-info-light p-3 rounded-xl text-center">
            <FileText className="w-5 h-5 text-info mx-auto mb-1" />
            <p className="text-xs text-muted-foreground mb-1">Contributions</p>
            <p className="font-bold text-foreground">₹{totalContributions.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-warning-light p-3 rounded-xl text-center">
            <CreditCard className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-xs text-muted-foreground mb-1">{t(language, 'loans')}</p>
            <p className="font-bold text-foreground">₹{totalLoans.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Members Summary */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          {t(language, 'members')} ({members.length})
        </h3>

        {members.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              {t(language, 'noMembers')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Member Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary-foreground">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-lg truncate">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {member.address}
                      </p>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-success-light p-3 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">
                        {t(language, 'balance')}
                      </p>
                      <p className="text-lg font-bold text-success">
                        ₹{member.balance.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${member.loan > 0 ? 'bg-warning-light' : 'bg-muted'}`}>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t(language, 'loan')}
                      </p>
                      <p className={`text-lg font-bold ${member.loan > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                        ₹{member.loan.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Repayments */}
                  {member.loanRepayments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        {t(language, 'repaymentHistory')}: {member.loanRepayments.length} payments
                      </p>
                      <p className="text-sm font-medium text-success">
                        Total Repaid: ₹{member.loanRepayments.reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-IN')}
                      </p>
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

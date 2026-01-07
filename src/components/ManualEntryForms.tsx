import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { PlusCircle, Coins, CreditCard, ArrowDownCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    updateMemberBalanceInFirestore,
    updateMemberLoanInFirestore,
    recordLoanRepaymentInFirestore,
} from '@/backend/members/members.service';

export const ManualEntryForms = () => {
    const language = useAppStore((state) => state.language);
    const groupInfo = useAppStore((state) => state.groupInfo);
    const members = useAppStore((state) => state.members);
    const updateMemberBalance = useAppStore((state) => state.updateMemberBalance);
    const addLoan = useAppStore((state) => state.addLoan);
    const addLoanRepayment = useAppStore((state) => state.addLoanRepayment);
    const addTransaction = useAppStore((state) => state.addTransaction);

    const [balanceForm, setBalanceForm] = useState({ memberId: '', amount: '' });
    const [loanForm, setLoanForm] = useState({ memberId: '', amount: '', interestRate: '' });
    const [repaymentForm, setRepaymentForm] = useState({ memberId: '', amount: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupInfo || !balanceForm.memberId || !balanceForm.amount) return;

        const amount = parseFloat(balanceForm.amount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid positive number',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const member = members.find((m) => m.id === balanceForm.memberId);
            if (!member) return;

            const newBalance = member.balance + amount;

            // Update local state
            updateMemberBalance(balanceForm.memberId, amount);

            // Add to transaction history
            addTransaction({
                type: 'balance',
                memberId: member.id,
                memberName: member.name,
                amount,
                description: `Added ₹${amount.toLocaleString('en-IN')} to balance`,
            });

            // Sync to Firestore
            await updateMemberBalanceInFirestore(groupInfo.id, member.id, newBalance);

            toast({
                title: t(language, 'updated') + '!',
                description: `${member.name}: +₹${amount.toLocaleString('en-IN')}`,
            });

            setBalanceForm({ memberId: '', amount: '' });
        } catch (error) {
            console.error('Failed to add balance:', error);
            toast({
                title: 'Error',
                description: 'Failed to add balance',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleIssueLoan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupInfo || !loanForm.memberId || !loanForm.amount) return;

        const amount = parseFloat(loanForm.amount);
        const interestRate = parseFloat(loanForm.interestRate) || groupInfo.defaultLoanInterestRate || 12;

        if (isNaN(amount) || amount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid positive number',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const member = members.find((m) => m.id === loanForm.memberId);
            if (!member) return;

            const newTotalLoan = member.loan + amount;

            // Update local state
            addLoan(loanForm.memberId, amount, interestRate);

            // Add to transaction history
            addTransaction({
                type: 'loan',
                memberId: member.id,
                memberName: member.name,
                amount,
                interestRate,
                description: `Loan of ₹${amount.toLocaleString('en-IN')} at ${interestRate}%`,
            });

            // Sync to Firestore
            await updateMemberLoanInFirestore(groupInfo.id, member.id, newTotalLoan, interestRate);

            toast({
                title: t(language, 'loanTaken') + ` - ${member.name}`,
                description: `₹${amount.toLocaleString('en-IN')} at ${interestRate}%`,
            });

            setLoanForm({ memberId: '', amount: '', interestRate: '' });
        } catch (error) {
            console.error('Failed to issue loan:', error);
            toast({
                title: 'Error',
                description: 'Failed to issue loan',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRecordRepayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupInfo || !repaymentForm.memberId || !repaymentForm.amount) return;

        const amount = parseFloat(repaymentForm.amount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid positive number',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const member = members.find((m) => m.id === repaymentForm.memberId);
            if (!member) return;

            const repaymentAmount = Math.min(amount, member.loan);
            const newLoanAmount = member.loan - repaymentAmount;

            const updatedRepayments = [
                ...member.loanRepayments,
                {
                    amount: repaymentAmount,
                    date: new Date().toISOString(),
                },
            ];

            // Sync to Firestore first
            await recordLoanRepaymentInFirestore(
                groupInfo.id,
                member.id,
                repaymentAmount,
                newLoanAmount,
                updatedRepayments
            );

            // Update local state
            addLoanRepayment(repaymentForm.memberId, amount);

            // Add to transaction history
            addTransaction({
                type: 'repayment',
                memberId: member.id,
                memberName: member.name,
                amount: repaymentAmount,
                description: `Repayment of ₹${repaymentAmount.toLocaleString('en-IN')}`,
            });

            toast({
                title: t(language, 'repayment') + ` - ${member.name}`,
                description: `₹${repaymentAmount.toLocaleString('en-IN')}`,
            });

            setRepaymentForm({ memberId: '', amount: '' });
        } catch (error) {
            console.error('Failed to record repayment:', error);
            toast({
                title: 'Error',
                description: 'Failed to record repayment',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                {t(language, 'manualEntry')}
            </h3>

            <Accordion type="single" collapsible className="space-y-2">
                {/* Add Balance */}
                <AccordionItem value="balance" className="bg-card border border-border rounded-xl">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-success-light rounded-lg flex items-center justify-center">
                                <Coins className="w-4 h-4 text-success" />
                            </div>
                            <span className="font-semibold text-foreground">{t(language, 'addBalance')}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <form onSubmit={handleAddBalance} className="space-y-3">
                            <div>
                                <Label htmlFor="balance-member">{t(language, 'selectMember')}</Label>
                                <Select
                                    value={balanceForm.memberId}
                                    onValueChange={(value) => setBalanceForm({ ...balanceForm, memberId: value })}
                                >
                                    <SelectTrigger id="balance-member">
                                        <SelectValue placeholder={t(language, 'chooseMember')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="balance-amount">{t(language, 'amount')} (₹)</Label>
                                <Input
                                    id="balance-amount"
                                    type="number"
                                    placeholder={t(language, 'enterAmount')}
                                    value={balanceForm.amount}
                                    onChange={(e) => setBalanceForm({ ...balanceForm, amount: e.target.value })}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!balanceForm.memberId || !balanceForm.amount || isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                                        {t(language, 'adding')}
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        {t(language, 'addBalance')}
                                    </>
                                )}
                            </Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>

                {/* Issue Loan */}
                <AccordionItem value="loan" className="bg-card border border-border rounded-xl">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-warning-light rounded-lg flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-warning" />
                            </div>
                            <span className="font-semibold text-foreground">{t(language, 'issueLoan')}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <form onSubmit={handleIssueLoan} className="space-y-3">
                            <div>
                                <Label htmlFor="loan-member">{t(language, 'selectMember')}</Label>
                                <Select
                                    value={loanForm.memberId}
                                    onValueChange={(value) => setLoanForm({ ...loanForm, memberId: value })}
                                >
                                    <SelectTrigger id="loan-member">
                                        <SelectValue placeholder={t(language, 'chooseMember')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="loan-amount">{t(language, 'loanAmountLabel')} (₹)</Label>
                                <Input
                                    id="loan-amount"
                                    type="number"
                                    placeholder={t(language, 'enterAmount')}
                                    value={loanForm.amount}
                                    onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label htmlFor="loan-interest">{t(language, 'interestRateLabel')} (%)</Label>
                                <Input
                                    id="loan-interest"
                                    type="number"
                                    placeholder={`Default: ${groupInfo?.defaultLoanInterestRate || 12}%`}
                                    value={loanForm.interestRate}
                                    onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!loanForm.memberId || !loanForm.amount || isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                                        {t(language, 'processing')}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        {t(language, 'issueLoan')}
                                    </>
                                )}
                            </Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>

                {/* Record Repayment */}
                <AccordionItem value="repayment" className="bg-card border border-border rounded-xl">
                    <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-info-light rounded-lg flex items-center justify-center">
                                <ArrowDownCircle className="w-4 h-4 text-info" />
                            </div>
                            <span className="font-semibold text-foreground">{t(language, 'recordRepayment')}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <form onSubmit={handleRecordRepayment} className="space-y-3">
                            <div>
                                <Label htmlFor="repayment-member">{t(language, 'selectMember')}</Label>
                                <Select
                                    value={repaymentForm.memberId}
                                    onValueChange={(value) => setRepaymentForm({ ...repaymentForm, memberId: value })}
                                >
                                    <SelectTrigger id="repayment-member">
                                        <SelectValue placeholder={t(language, 'chooseMember')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.filter((m) => m.loan > 0).map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.name} (Loan: ₹{member.loan.toLocaleString('en-IN')})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="repayment-amount">{t(language, 'repaymentAmount')} (₹)</Label>
                                <Input
                                    id="repayment-amount"
                                    type="number"
                                    placeholder={t(language, 'enterAmount')}
                                    value={repaymentForm.amount}
                                    onChange={(e) => setRepaymentForm({ ...repaymentForm, amount: e.target.value })}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!repaymentForm.memberId || !repaymentForm.amount || isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                                        {t(language, 'recordingButton')}
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownCircle className="w-4 h-4 mr-2" />
                                        {t(language, 'recordRepayment')}
                                    </>
                                )}
                            </Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

import { useState } from 'react';
import { useAppStore, Transaction } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Coins, CreditCard, ArrowDownCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export const TransactionHistory = () => {
    const language = useAppStore((state) => state.language);
    const transactions = useAppStore((state) => state.transactions);
    const editTransaction = useAppStore((state) => state.editTransaction);
    const deleteTransaction = useAppStore((state) => state.deleteTransaction);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [editAmount, setEditAmount] = useState('');
    const [editInterestRate, setEditInterestRate] = useState('');

    const handleDeleteClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditAmount(transaction.amount.toString());
        setEditInterestRate(transaction.interestRate?.toString() || '');
        setEditDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedTransaction) return;

        deleteTransaction(selectedTransaction.id);
        toast({
            title: 'Transaction Deleted',
            description: 'The transaction has been reversed and removed',
        });
        setDeleteDialogOpen(false);
        setSelectedTransaction(null);
    };

    const confirmEdit = () => {
        if (!selectedTransaction) return;

        const newAmount = parseFloat(editAmount);
        if (isNaN(newAmount) || newAmount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid positive number',
                variant: 'destructive',
            });
            return;
        }

        const updates: any = { amount: newAmount };
        if (selectedTransaction.type === 'loan' && editInterestRate) {
            const newRate = parseFloat(editInterestRate);
            if (!isNaN(newRate) && newRate >= 0) {
                updates.interestRate = newRate;
            }
        }

        editTransaction(selectedTransaction.id, updates);
        toast({
            title: 'Transaction Updated',
            description: 'The transaction has been updated successfully',
        });
        setEditDialogOpen(false);
        setSelectedTransaction(null);
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'balance':
                return <Coins className="w-4 h-4 text-success" />;
            case 'loan':
                return <CreditCard className="w-4 h-4 text-warning" />;
            case 'repayment':
                return <ArrowDownCircle className="w-4 h-4 text-info" />;
            default:
                return null;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'balance':
                return 'bg-success-light';
            case 'loan':
                return 'bg-warning-light';
            case 'repayment':
                return 'bg-info-light';
            default:
                return 'bg-muted';
        }
    };

    const getTransactionLabel = (type: string) => {
        switch (type) {
            case 'balance':
                return 'Balance Added';
            case 'loan':
                return 'Loan Issued';
            case 'repayment':
                return 'Repayment';
            default:
                return type;
        }
    };

    if (transactions.length === 0) {
        return null;
    }

    return (
        <>
            <div className="px-4 mt-6 pb-24">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Transaction History
                </h3>

                <div className="space-y-2">
                    {transactions.slice(0, 20).map((transaction) => (
                        <div
                            key={transaction.id}
                            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 ${getTransactionColor(transaction.type)} rounded-lg flex items-center justify-center`}>
                                    {getTransactionIcon(transaction.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-foreground">{transaction.memberName}</p>
                                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                            {getTransactionLabel(transaction.type)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        ₹{transaction.amount.toLocaleString('en-IN')}
                                        {transaction.interestRate && ` • ${transaction.interestRate}% interest`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(transaction.timestamp), 'MMM d, yyyy • h:mm a')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditClick(transaction)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(transaction)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t(language, 'deleteTransaction')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will reverse the transaction and remove it from history. This action cannot be undone.
                            {selectedTransaction && (
                                <div className="mt-3 p-3 bg-muted rounded-lg">
                                    <p className="font-semibold">{selectedTransaction.memberName}</p>
                                    <p className="text-sm">
                                        {getTransactionLabel(selectedTransaction.type)}: ₹
                                        {selectedTransaction.amount.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t(language, 'cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Transaction Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t(language, 'editTransaction')}</DialogTitle>
                        <DialogDescription>
                            Modify the transaction details. Changes will be reflected in member balances.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="space-y-4 py-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="font-semibold">{selectedTransaction.memberName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {getTransactionLabel(selectedTransaction.type)}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="edit-amount">{t(language, 'amount')} (₹)</Label>
                                <Input
                                    id="edit-amount"
                                    type="number"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {selectedTransaction.type === 'loan' && (
                                <div>
                                    <Label htmlFor="edit-interest">{t(language, 'interestRateLabel')} (%)</Label>
                                    <Input
                                        id="edit-interest"
                                        type="number"
                                        value={editInterestRate}
                                        onChange={(e) => setEditInterestRate(e.target.value)}
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

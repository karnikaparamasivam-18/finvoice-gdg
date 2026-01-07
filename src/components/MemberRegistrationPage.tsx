import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, UserPlus, Users, MapPin, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addMemberToGroup } from "@/backend/members/members.service";


export const MemberRegistrationPage = () => {
  const language = useAppStore((state) => state.language);
  const groupInfo = useAppStore((state) => state.groupInfo);
  const members = useAppStore((state) => state.members);
  const addMember = useAppStore((state) => state.addMember);
  const completeSetup = useAppStore((state) => state.completeSetup);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  const handleAddMember = async (e: React.FormEvent) => {
  e.preventDefault(); // ✅ PREVENT PAGE REFRESH
  
  if (!groupInfo) return;

  const memberId = crypto.randomUUID(); // ✅ ONE ID

  const newMember = {
    id: memberId,
    name: formData.name,
    address: formData.address,
    balance: 0,
    loan: 0,
    loanInterestRate: 0,
    loanRepayments: [],
  };

  try {
    // 1️⃣ Save to Zustand
    addMember({
      id: memberId, // 🔥 PASS SAME ID
      name: newMember.name,
      address: newMember.address,
    });

    // 2️⃣ Save to Firestore
    await addMemberToGroup(groupInfo.id, newMember);
    
    toast({
      title: "Member Added",
      description: `${formData.name} has been added to the group.`,
    });

    setFormData({ name: "", address: "" });
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to add member",
      variant: "destructive",
    });
  }
};


  const handleFinish = () => {
    completeSetup();
    navigate('/dashboard');
  };

  const canFinish = members.length >= (groupInfo?.memberCount || 0);
  const progress = (members.length / (groupInfo?.memberCount || 1)) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/setup')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(language, 'back')}
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t(language, 'memberRegistration')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {groupInfo?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 p-4 bg-card rounded-xl border border-border shadow-soft">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              {t(language, 'membersAdded')}
            </span>
            <span className="text-sm font-bold text-primary">
              {members.length} / {groupInfo?.memberCount}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAddMember} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4 text-primary" />
              {t(language, 'memberName')}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter member name"
              className="h-12 bg-card border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              {t(language, 'memberAddress')}
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter address"
              className="h-12 bg-card border-border focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={!formData.name || !formData.address || members.length >= (groupInfo?.memberCount || 0)}
            className="w-full py-5 font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t(language, 'addMember')}
          </Button>
        </form>

        {/* Members List */}
        {members.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Added Members
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border animate-scale-in"
                >
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.address}</p>
                  </div>
                  <Check className="w-5 h-5 text-success" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finish Button */}
        <Button
          onClick={handleFinish}
          disabled={!canFinish}
          size="lg"
          className="w-full py-6 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {t(language, 'finishSetup')}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {!canFinish && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Add {(groupInfo?.memberCount || 0) - members.length} more members to continue
          </p>
        )}
      </div>
    </div>
  );
};

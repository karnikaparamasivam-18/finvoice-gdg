import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore, MeetingFrequency } from "@/store/appStore";
import { t } from "@/utils/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Calendar,
  Coins,
  Building2,
} from "lucide-react";

import { createGroup } from "@/backend/groups/group.service";
import { useAuth } from "@/backend/auth/useAuth";

export const GroupSetupPage = () => {
  const language = useAppStore((state) => state.language);
  const setGroupInfo = useAppStore((state) => state.setGroupInfo);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    memberCount: "",
    meetingFrequency: "monthly" as MeetingFrequency,
    firstMeetingDate: "",
    contributionAmount: "",
  });

  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const groupData = {
    id: crypto.randomUUID(),
    name: formData.name,
    memberCount: Number(formData.memberCount),
    meetingFrequency: formData.meetingFrequency,
    firstMeetingDate: formData.firstMeetingDate,
    contributionAmount: Number(formData.contributionAmount),
  };

  // 1️⃣ Save locally (Zustand)
  setGroupInfo(groupData);

  // 2️⃣ Save to Firestore
  try {
    await createGroup(groupData);
    navigate("/members");
  } catch (error) {
    console.error("Failed to create group:", error);
    alert("Failed to save group. Please try again.");
  }
};



  const isFormValid =
    formData.name &&
    formData.memberCount &&
    formData.firstMeetingDate &&
    formData.contributionAmount;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(language, "back")}
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t(language, "groupSetup")}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Set up your Self Help Group details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4 text-primary" />
              {t(language, "groupName")}
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter group name"
              className="h-12 bg-card"
            />
          </div>

          {/* Member Count */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4 text-primary" />
              {t(language, "numberOfMembers")}
            </Label>
            <Input
              type="number"
              min="1"
              value={formData.memberCount}
              onChange={(e) =>
                setFormData({ ...formData, memberCount: e.target.value })
              }
              className="h-12 bg-card"
            />
          </div>

          {/* Meeting Frequency */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              {t(language, "meetingFrequency")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(["weekly", "monthly"] as MeetingFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, meetingFrequency: freq })
                  }
                  className={`p-4 rounded-xl border-2 ${
                    formData.meetingFrequency === freq
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  {t(language, freq)}
                </button>
              ))}
            </div>
          </div>

          {/* First Meeting Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              {t(language, "firstMeetingDate")}
            </Label>
            <Input
              type="date"
              value={formData.firstMeetingDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstMeetingDate: e.target.value,
                })
              }
              className="h-12 bg-card"
            />
          </div>

          {/* Contribution */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Coins className="w-4 h-4 text-primary" />
              {t(language, "contributionAmount")}
            </Label>
            <Input
              type="number"
              min="1"
              value={formData.contributionAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contributionAmount: e.target.value,
                })
              }
              className="h-12 bg-card"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            size="lg"
            className="w-full py-6 text-lg font-semibold gradient-primary"
          >
            {loading ? "Saving..." : t(language, "next")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};

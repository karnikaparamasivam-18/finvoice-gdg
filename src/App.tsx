import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { WelcomePage } from "./components/WelcomePage";
import { GroupSetupPage } from "./components/GroupSetupPage";
import { MemberRegistrationPage } from "./components/MemberRegistrationPage";
import { Dashboard } from "./components/Dashboard";
import { LoansPage } from "./components/LoansPage";
import { SummaryPage } from "./components/SummaryPage";
import { MeetingsPage } from "./components/MeetingsPage";
import { SettingsPage } from "./components/SettingsPage";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./pages/AuthPage";

import { useAuth } from "@/backend/auth/useAuth";
import { useLoadFromFirestore } from "@/hooks/useLoadFromFirestore";
import { useSmartRoute } from "@/hooks/useSmartRoute";

const queryClient = new QueryClient();

/* ======================
   AUTH GUARD
   ====================== */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for Firebase
  if (!user) return <Navigate to="/auth" replace />;

  return children;
};

const RootRoute = () => {
  // ✅ Smart routing based on auth and setup state
  useSmartRoute();
  return null; // This will redirect
};

const AppWithDataLoad = () => {
  // ✅ Load data from Firestore on app start
  useLoadFromFirestore();

  return (
    <Routes>

      {/* AUTH (ONLY PUBLIC PAGE) */}
      <Route path="/auth" element={<AuthPage />} />

      {/* SMART ROOT ROUTE - Redirects based on auth & setup state */}
      <Route path="/" element={<RootRoute />} />

      {/* LANGUAGE PAGE - For new users */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      {/* GROUP SETUP */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <GroupSetupPage />
          </ProtectedRoute>
        }
      />

      {/* MEMBERS */}
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <MemberRegistrationPage />
          </ProtectedRoute>
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* LOANS */}
      <Route
        path="/loans"
        element={
          <ProtectedRoute>
            <LoansPage />
          </ProtectedRoute>
        }
      />

      {/* SUMMARY */}
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <SummaryPage />
          </ProtectedRoute>
        }
      />

      {/* MEETINGS */}
      <Route
        path="/meetings"
        element={
          <ProtectedRoute>
            <MeetingsPage />
          </ProtectedRoute>
        }
      />

      {/* SETTINGS */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithDataLoad />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/translations';
import { Home, CreditCard, FileText, Calendar, Settings } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, labelKey: 'home' as const },
  { path: '/loans', icon: CreditCard, labelKey: 'loans' as const },
  { path: '/summary', icon: FileText, labelKey: 'summary' as const },
  { path: '/meetings', icon: Calendar, labelKey: 'meetings' as const },
  { path: '/settings', icon: Settings, labelKey: 'settings' as const },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const language = useAppStore((state) => state.language);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">
                {t(language, item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Calculator,
  CalendarDays,
  Gift,
  Landmark,
  Umbrella,
  Briefcase,
  CalendarCheck,
  Menu as MenuIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const links = [
  { to: '/', icon: Calculator, labelKey: 'nav.payroll', descriptionKey: 'nav.payrollDesc' },
  { to: '/easter-bonus', icon: Gift, labelKey: 'nav.easter', descriptionKey: 'nav.easterDesc' },
  { to: '/christmas-bonus', icon: Gift, labelKey: 'nav.christmas', descriptionKey: 'nav.christmasDesc' },
  { to: '/vacation-allowance', icon: Umbrella, labelKey: 'nav.vacation', descriptionKey: 'nav.vacationDesc' },
  { to: '/severance', icon: Briefcase, labelKey: 'nav.severance', descriptionKey: 'nav.severanceDesc' },
  { to: '/leave-balance', icon: CalendarCheck, labelKey: 'nav.leaveBalance', descriptionKey: 'nav.leaveBalanceDesc' },
  { to: '/employer', icon: Landmark, labelKey: 'nav.employer', descriptionKey: 'nav.employerDesc' },
  { to: '/yearly', icon: CalendarDays, labelKey: 'nav.yearly', descriptionKey: 'nav.yearlyDesc', beta: true },
];

type NavigationMenuVariant = 'desktop' | 'mobile';

interface NavigationMenuProps {
  variant?: NavigationMenuVariant;
}

export function NavigationMenu({ variant = 'desktop' }: NavigationMenuProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const renderLinks = () => (
    <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">{t('nav.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('nav.subtitle')}</p>
      </div>
      <nav className="divide-y divide-border" role="navigation">
        {links.map(({ to, icon: Icon, labelKey, descriptionKey, beta }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
              className={`relative flex items-start gap-3 p-4 transition-colors ${
                active ? 'bg-primary/10' : 'hover:bg-muted/60'
              }`}
            >
              {beta && (
                <span className="absolute right-2 top-2 rotate-12 bg-red-600 text-white px-4 py-1 text-[10px] font-semibold shadow-lg z-10">
                  BETA
                </span>
              )}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  active ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${active ? 'text-foreground' : 'text-foreground'}`}>{t(labelKey)}</p>
                <p className="text-sm text-muted-foreground">{t(descriptionKey)}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex items-center gap-2 px-4 py-2 w-full justify-between border border-border rounded-lg bg-background shadow-card"
        >
          <div className="flex items-center gap-2">
            <MenuIcon className="w-5 h-5" />
            <span className="font-medium">{t('nav.menuButton')}</span>
          </div>
          <span className="text-sm text-muted-foreground">{isOpen ? t('common.close') : t('common.open')}</span>
        </button>
        {isOpen && (
          <div id="mobile-navigation" className="mt-4 animate-fade-in">
            {renderLinks()}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="space-y-4 hidden lg:block" aria-label={t('nav.title')}>
      {renderLinks()}
    </aside>
  );
}

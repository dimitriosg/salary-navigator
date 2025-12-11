import { Link, useLocation } from 'react-router-dom';
import { Calculator, CalendarDays, Gift, Landmark, Umbrella, Briefcase, CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const links = [
  { to: '/', icon: Calculator, labelKey: 'nav.payroll', descriptionKey: 'nav.payrollDesc' },
  { to: '/employer', icon: Landmark, labelKey: 'nav.employer', descriptionKey: 'nav.employerDesc' },
  { to: '/easter-bonus', icon: Gift, labelKey: 'nav.easter', descriptionKey: 'nav.easterDesc' },
  { to: '/christmas-bonus', icon: Gift, labelKey: 'nav.christmas', descriptionKey: 'nav.christmasDesc' },
  { to: '/vacation-allowance', icon: Umbrella, labelKey: 'nav.vacation', descriptionKey: 'nav.vacationDesc' },
  { to: '/severance', icon: Briefcase, labelKey: 'nav.severance', descriptionKey: 'nav.severanceDesc' },
  { to: '/leave-balance', icon: CalendarCheck, labelKey: 'nav.leaveBalance', descriptionKey: 'nav.leaveBalanceDesc' },
  { to: '/yearly', icon: CalendarDays, labelKey: 'nav.yearly', descriptionKey: 'nav.yearlyDesc' },
];

export function NavigationMenu() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className="space-y-4" aria-label={t('nav.title')}>
      <div className="relative">
        <span className="absolute -left-10 -top-3 -rotate-45 bg-primary text-primary-foreground px-6 py-1 text-xs font-semibold shadow-lg">
          BETA
        </span>
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">{t('nav.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('nav.subtitle')}</p>
          </div>
          <nav className="divide-y divide-border" role="navigation">
            {links.map(({ to, icon: Icon, labelKey, descriptionKey }) => {
              const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-start gap-3 p-4 transition-colors ${
                    active ? 'bg-primary/10' : 'hover:bg-muted/60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      active ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${active ? 'text-foreground' : 'text-foreground'}`}>
                      {t(labelKey)}
                    </p>
                    <p className="text-sm text-muted-foreground">{t(descriptionKey)}</p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

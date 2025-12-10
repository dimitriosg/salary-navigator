import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, Building2, Calculator, CalendarRange, Plane, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const links = [
  { to: '/', icon: Calculator, labelKey: 'menu.payroll' },
  { to: '/yearly', icon: CalendarRange, labelKey: 'menu.yearly' },
  { to: '/employer', icon: Building2, labelKey: 'menu.employer' },
  { to: '/bonus/easter', icon: Gift, labelKey: 'menu.easterBonus' },
  { to: '/bonus/christmas', icon: Gift, labelKey: 'menu.christmasBonus' },
  { to: '/vacation-allowance', icon: Plane, labelKey: 'menu.vacationAllowance' },
  { to: '/severance', icon: ShieldCheck, labelKey: 'menu.severance' },
];

export function RightMenu() {
  const { t } = useLanguage();

  return (
    <Card className="sticky top-6 shadow-card border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">{t('tabs.calculator')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm border border-transparent hover:bg-muted/60 ${
                isActive ? 'bg-primary/10 border-primary/40 text-primary' : 'text-foreground'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </CardContent>
    </Card>
  );
}

import { ReactNode } from 'react';
import { ThemeLanguageToggle } from '@/components/ThemeLanguageToggle';
import { NavigationMenu } from '@/components/NavigationMenu';

interface PageLayoutProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ title, subtitle, icon, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full gradient-hero py-12 px-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-4">
            <ThemeLanguageToggle />
          </div>
          <div className="text-center animate-fade-in">
            {icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6 shadow-glow">
                {icon}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">{title}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">{children}</div>
          <NavigationMenu />
        </div>
      </main>

      <footer className="w-full py-6 px-4 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">Κατασκευάστηκε για γρήγορους υπολογισμούς μισθοδοσίας.</p>
        </div>
      </footer>
    </div>
  );
}

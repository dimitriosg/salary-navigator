import { ReactNode } from 'react';
import { Euro } from 'lucide-react';
import { ThemeLanguageToggle } from './ThemeLanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { RightMenu } from './RightMenu';

interface PageTemplateProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function PageTemplate({ title, subtitle, children }: PageTemplateProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full gradient-hero py-12 px-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-4">
            <ThemeLanguageToggle />
          </div>
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6 shadow-glow">
              <Euro className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
          <div className="animate-slide-up">{children}</div>
          <RightMenu />
        </div>
      </main>

      <footer className="w-full py-6 px-4 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}

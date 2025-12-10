import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function ThemeLanguageToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
        className="h-9 px-3 text-primary-foreground hover:bg-primary-foreground/10 font-medium"
      >
        <Globe className="h-4 w-4 mr-1" />
        {language === 'el' ? 'EN' : 'ΕΛ'}
      </Button>
    </div>
  );
}

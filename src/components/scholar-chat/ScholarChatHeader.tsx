
"use client";
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ScholarChatHeader: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8 text-center relative">
      <div className="flex justify-center items-center relative">
        <h1 className="text-4xl font-bold text-primary">
          Scholar Chat
        </h1>
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="absolute right-0 ml-4" 
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      <p className="text-lg text-muted-foreground mt-2">
        Upload your research paper, get summaries, keywords, and ask questions.
      </p>
    </header>
  );
};

export default ScholarChatHeader;

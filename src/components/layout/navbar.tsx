'use client';

import React, { useEffect } from 'react';
import { Moon, Sun, Search, Bell } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { MobileNav } from './mobile-nav';

export function Navbar() {
  const { isDarkMode, toggleTheme } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="h-16 border-b bg-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="relative hidden sm:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents & frameworks..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary">
            ED
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold leading-tight">Founder Mode</span>
            <span className="text-[10px] text-muted-foreground">Self-Directed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
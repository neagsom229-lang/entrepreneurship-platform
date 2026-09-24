'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  UploadCloud,
  Moon,
  Sun,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/use-app-store';

const routes = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, desc: 'Track your reading' },
  { name: 'Document Library', href: '/documents', icon: BookOpen, desc: 'Browse frameworks' },
  { name: 'Upload & Create', href: '/upload', icon: UploadCloud, desc: 'Author new content' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useAppStore();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="p-2 rounded-lg border hover:bg-muted text-muted-foreground"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md p-5 flex flex-col">
          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive =
                pathname === route.href ||
                (route.href !== '/dashboard' && pathname.startsWith(route.href));
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col">
                    <span>{route.name}</span>
                    <span className={cn('text-[10px]', isActive ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                      {route.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border bg-card text-sm font-medium"
            >
              <span className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span
                className={cn(
                  'w-9 h-5 rounded-full transition-colors relative',
                  isDarkMode ? 'bg-primary' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                    isDarkMode ? 'translate-x-[18px]' : 'translate-x-0.5'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
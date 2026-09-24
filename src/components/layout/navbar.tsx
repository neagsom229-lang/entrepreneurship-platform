'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Search, Command, X } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { MobileNav } from './mobile-nav';

export function Navbar() {
  const { isDarkMode, toggleTheme, documents } = useAppStore();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Keyboard shortcut: "/" focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Live search results
  const results = query.trim()
    ? documents
        .filter(
          (d) =>
            d.title.toLowerCase().includes(query.toLowerCase()) ||
            d.summary.toLowerCase().includes(query.toLowerCase()) ||
            d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  // Breadcrumb from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.length > 0 ? segments[segments.length - 1] : 'Dashboard';

  return (
    <header className="h-16 border-b bg-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MobileNav />

        {/* Search with dropdown */}
        <div className="relative hidden sm:block w-80 max-w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search documents & frameworks..."
            className="w-full text-xs pl-9 pr-16 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono text-muted-foreground">
                <Command className="w-2.5 h-2.5" />/
              </kbd>
            )}
          </div>

          {/* Results dropdown */}
          {focused && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-lg border bg-popover shadow-lg overflow-hidden z-50">
              <div className="px-3 py-1.5 border-b bg-muted/30 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  onClick={() => setQuery('')}
                  className="block px-3 py-2.5 hover:bg-muted/50 transition-colors border-b last:border-0"
                >
                  <div className="text-xs font-semibold truncate">{doc.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {doc.category} · {doc.readTime} min read
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Breadcrumb on mobile */}
        <div className="sm:hidden text-xs font-semibold capitalize truncate">
          {breadcrumb}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary">
            ED
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold leading-tight">Founder Mode</span>
            <span className="text-[10px] text-muted-foreground">Self-Directed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
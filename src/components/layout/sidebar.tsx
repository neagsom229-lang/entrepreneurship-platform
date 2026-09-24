'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  UploadCloud,
  ChevronLeft,
  PanelLeftOpen,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Document Library', href: '/documents', icon: BookOpen },
  { name: 'Upload & Create', href: '/upload', icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-card shrink-0 h-screen sticky top-0 transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center px-4 border-b gap-2.5 justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shrink-0">
            E
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none">LessonHub</span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">
                Entrepreneur
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors shrink-0"
        >
          {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Platform
          </div>
        )}

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                collapsed && 'justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Plan badge */}
      {!collapsed && (
        <div className="p-4 border-t m-3 bg-muted/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" />
              Curated Edition
            </span>
            <span className="text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal">
            13+ frameworks across venture development ready to explore.
          </p>
        </div>
      )}
    </aside>
  );
}
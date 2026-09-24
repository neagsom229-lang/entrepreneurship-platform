'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  UploadCloud,
  BookmarkCheck,
  Compass,
  Settings,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Document Library', href: '/documents', icon: BookOpen },
  { name: 'Upload & Create', href: '/upload', icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
          E
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight leading-none">LessonHub</span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">Entrepreneur</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Platform
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Status / Plan Badge */}
      <div className="p-4 border-t m-3 bg-muted/40 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>Curated Edition</span>
          <span className="text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">v1.0</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-normal">
          13+ frameworks across venture development ready to explore.
        </p>
      </div>
    </aside>
  );
}
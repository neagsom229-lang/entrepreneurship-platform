'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, BookOpen, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Library', href: '/documents', icon: BookOpen },
    { name: 'Upload & Create', href: '/upload', icon: UploadCloud },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg border hover:bg-muted text-muted-foreground"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md p-6 border-b flex flex-col gap-2">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {route.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
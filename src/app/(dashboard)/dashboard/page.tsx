'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Bookmark,
  StickyNote,
  TrendingUp,
  ArrowRight,
  Clock,
  PlusCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';

export default function DashboardPage() {
  const { documents, bookmarks, notes, progress } = useAppStore();

  // Metrics
  const totalDocs = documents.length;
  const bookmarkedDocs = documents.filter((d) => bookmarks.includes(d.id));
  const progressEntries = Object.values(progress);
  const completedDocsCount = progressEntries.filter((p) => p.percentage >= 90).length;

  // Recently read (documents with progress)
  const recentlyRead = progressEntries
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .slice(0, 3)
    .map((p) => ({
      doc: documents.find((d) => d.id === p.documentId),
      percentage: p.percentage,
    }))
    .filter((item) => item.doc !== undefined);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Founder Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track reading velocity, access active bookmarks, and resume essential frameworks.
          </p>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Upload Document
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Library</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">{totalDocs}</div>
          <p className="text-[11px] text-muted-foreground">Curated frameworks</p>
        </div>

        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Bookmarks</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold">{bookmarks.length}</div>
          <p className="text-[11px] text-muted-foreground">Saved for review</p>
        </div>

        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Notes Captured</span>
            <StickyNote className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold">{notes.length}</div>
          <p className="text-[11px] text-muted-foreground">Personal annotations</p>
        </div>

        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Completed</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold">{completedDocsCount}</div>
          <p className="text-[11px] text-muted-foreground">Over 90% completed</p>
        </div>
      </div>

      {/* Two Column Layout: Resume Reading & Bookmarked Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Continue Reading */}
        <div className="border rounded-xl p-5 bg-card space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Resume Reading
            </h2>
            <Link href="/documents" className="text-xs text-primary hover:underline">
              View All
            </Link>
          </div>

          {recentlyRead.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No active reading history yet. Start exploring the library.
            </div>
          ) : (
            <div className="space-y-3">
              {recentlyRead.map((item) => (
                <Link
                  key={item.doc!.id}
                  href={`/documents/${item.doc!.id}`}
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.doc!.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Bookmarked Frameworks */}
        <div className="border rounded-xl p-5 bg-card space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" /> Bookmarked Frameworks
            </h2>
            <span className="text-xs text-muted-foreground">{bookmarkedDocs.length} items</span>
          </div>

          {bookmarkedDocs.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No saved frameworks. Click the bookmark icon inside any document.
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarkedDocs.slice(0, 3).map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="space-y-0.5 max-w-[85%]">
                    <div className="text-xs font-bold truncate group-hover:text-primary">
                      {doc.title}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {doc.category} • {doc.readTime} min read
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}